import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ConversationModel } from 'src/app/Models/Conversation';
import { User } from 'src/app/Models/UserModel';
import { UserServiceService } from 'src/app/Service/user-service.service';
import { Participant } from './../../../Models/ConversationParticipant';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.component.html',
  styleUrls: ['./new-group.component.scss']
})
export class NewGroupComponent implements OnInit {

  participantUsers: User[] = [];
  users: User[] = [];
  allUsers: User[] = [];
  userAuthenticated: number = 0;
  exist: boolean = false;
  form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<NewGroupComponent>,
    private userService: UserServiceService,
    private formBuilder: FormBuilder
  ) { }
  
  ngOnInit(): void {
    this.userAuthenticated = this.userService.GetUserAuthenticated();
   
    const user: User = {
      id:  this.userAuthenticated,
      lastname: '',
      firstname: '',
      gender: '',
      age: 0,
      departmentId: 0,
      email: '',
      password: '',
      status: false,
      acess: ''
    };
    

     this.participantUsers.push(user);
    this.userService.GetUsers().subscribe(userData => {
           
      if(userData.data){
        this.users = userData.data;
        this.allUsers = userData.data;
        this.users = this.users.filter(u => u.id !== this.userAuthenticated);
      }
    });

    this.form = this.formBuilder.group({
      groupName: ['', Validators.required] // Definindo o controle 'groupName' no FormGroup
    });
  }

  Close(){

    this.dialogRef.close();
  }
  search(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value.toLowerCase();
    
    this.users = this.users.filter(user => {
      return (user.firstname.toLowerCase().includes(value)) || (user.lastname.toLowerCase().includes(value));
    });
    if(value === ''){
        this.users = this.allUsers
    }
  }
   
  onSubmit(): void {
     
    if (this.form.valid) {
      const userConversation: ConversationModel = {
        id: 0,
        title: this.form.value.groupName, // Acessando o valor do campo 'groupName'
        createdAt: new Date().toISOString(),
        status: true,
        type: 'group'
      };

      // Salvar a conversa
      this.SaveConversations(userConversation);
    } else {
      console.log('Formulário inválido. Verifique os campos.');
    }
  }

  getParticipant(user: User): void {
    // Verifica se o usuário já está na lista de participantes
    const index = this.participantUsers.findIndex(u => u.id === user.id);

    if (index !== -1) {
      // Se o usuário já estiver na lista, remove-o
      this.participantUsers.splice(index, 1);
    } else {
      // Caso contrário, adiciona o usuário à lista
      this.participantUsers.push(user);
    }

    console.log(this.participantUsers);
  }

  isSelected(user: User): boolean {
    // Verifica se o usuário está na lista de participantes
    return this.participantUsers.some(u => u.id === user.id);
  }

  // Processo de salvar uma conversa
  SaveConversations(userConversation: ConversationModel): void {
    this.userService.CreateConversation(userConversation).subscribe(
      (response) => {
          if(response.data){
             // Pegando o ID da nova conversa
        const conversationId = response.data;
        // Adicionando os participantes à conversa
       
        
     
     console.log('All users', this.participantUsers)

        this.participantUsers.forEach(user => {
          
          const participant: Participant = {
            userId: user.id,
            conversationId: conversationId,
            status: true
          };

          this.AddParticipants(participant);
        });

          this.showSuccessMessage1();
        // Fechando o modal após salvar a conversa
            this.dialogRef.close();
          }
      },
      (error) => {
        console.error('Erro ao criar conversa:', error);
      }
    );
  }

  // Processo de adicionar participante em uma conversa
  AddParticipants(participant: Participant): void {
    this.userService.AddParticipants(participant).subscribe(
      (response) => {
        console.log('Participante adicionado com sucesso:', response.data);
      },
      (error) => {
        console.error('Erro ao adicionar participante:', error);
      }
    );
  }
  showSuccessMessage1() {
    Swal.fire({
      icon: 'success',
      title: 'Group Created Successfully',
      showConfirmButton: false,
      timer: 2000 // 2 segundos
    });
  }
}
