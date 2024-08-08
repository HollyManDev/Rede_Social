import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Document_or_Message } from 'src/app/Models/Document_or_Message';
import { User } from 'src/app/Models/UserModel';
import { UserServiceService } from 'src/app/Service/user-service.service';
import { Message } from 'src/app/Models/MessageModel';
import { Participant } from 'src/app/Models/ConversationParticipant';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forward',
  templateUrl: './forward.component.html',
  styleUrls: ['./forward.component.scss']
})
export class ForwardComponent {

  participantUsers: User[] = [];
  users: User[] = [];
  allUsers: User[] = [];
  message!: Document_or_Message
  conversationId: number = 0;
  userAuthenticated: number = 0;

  constructor(
    public dialogRef: MatDialogRef<ForwardComponent>,
    private userService: UserServiceService,
  ) { }
  
  ngOnInit(): void {
   //this.userAuthenticated = this.userService.GetUserAuthenticated();
 

    this.userService.GetUsers().subscribe(userData => {
           
      if(userData.data){
        this.users = userData.data;
        this.allUsers = userData.data;
        this.users = this.users.filter(u => u.id !== this.userAuthenticated);
      }
    });

  }

  Close(){

    this.dialogRef.close();
  }

  Send(){
         
     if(this.participantUsers.length > 0){
       
        this.participantUsers.forEach(i => {
           
              if(i.id != this.userAuthenticated){
              
                  const user: User = {
                    id:  i.id,
                    lastname: i.lastname,
                    firstname: i.firstname,
                    gender: i.gender,
                    age: i.age,
                    departmentId: i.departmentId,
                    email: i.email,
                    password: i.password,
                    status: false,
                    acess: i.acess
                  };
                  this.userService.SetUserEdition(user);
                  this.message = this.userService.GetMessageEdition();
                  const participant2: Participant = {
                   userId:this.message.userId,
                   participantId: i.id,
                   conversationId: 0,
                   status: true
                 };
               
                 this.userService.GetConversationId(participant2).subscribe(
                   (response) => {
                       if (response.data) {
                      
                      this.conversationId = response.data;                      
                      const message : Message ={
                      id: this.message.id,
                      content:  this.message.content_or_FileName,
                      sentAt: new Date().toISOString(),
                      idConversation: this.conversationId,
                      status: true,
                      userId: this.message.userId,
                      seen: false
           }
              
           this.userService.UserMessage(message).subscribe(
            (response) => {
                 
            if(response.data){
              
              this.dialogRef.close();
            }
                    
            },
            (messageError) => {
              console.error('Erro ao enviar mensagem:', messageError);
            }
          );
                     }
                   },
                   (error) => {
                     console.error('Erro ao obter ID da conversa:', error);
                   }
                 );
                }

          });   

      }
      else{
        this.showSuccessMessage1();
      }

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

  

  showSuccessMessage1() {
    Swal.fire({
      icon: 'warning',
      title: 'There is no chat selected!',
      showConfirmButton: false,
      timer: 2000 // 2 segundos
    });
  }
  
}
