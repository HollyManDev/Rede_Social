import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserServiceService } from './../../Service/user-service.service';
import { User } from 'src/app/Models/UserModel';
import { UserContent } from './../../Models/UserContentModel';
import { Documents } from './../../Models/Document'; 
import { Message } from 'src/app/Models/MessageModel';
import { ConversationModel } from './../../Models/Conversation';
import { UsersConversationsParticipants } from './../../Models/usersConversationsParticipants';
import { Document_or_Message } from 'src/app/Models/Document_or_Message';
import { Participant } from 'src/app/Models/ConversationParticipant';

@Component({
  selector: 'app-main-uioperations',
  templateUrl: './main-uioperations.component.html',
  styleUrls: ['./main-uioperations.component.scss']
})
export class MainUIOperationsComponent implements OnInit {
  userContent!: UserContent; 
  users: User[] = [];
  allUsers: User[] = [];
  allConversations!: UsersConversationsParticipants;
  selectedUser = '';
  loggedUserName = '';
  exist = false; 
  clicked = false;
  userAuthenticated = 0;
  selectedFile: File | null = null;
  participantId = 0;
  messageForm!: FormGroup;
  messDoc!: Document_or_Message; 

  constructor(private userService: UserServiceService) {}

  ngOnInit(): void {
    this.messageForm = new FormGroup({
      userMessage: new FormControl('', Validators.required),
      conversationId: new FormControl(0),
      userId: new FormControl(0)
    });

    this.userAuthenticated = this.userService.GetUserAuthenticated();

    this.userService.GetUsers().subscribe(userData => {
      this.allUsers = userData.data;
      this.users = userData.data;
    });

    this.userService.GetConversations(this.userAuthenticated).subscribe(userData => {
      this.allConversations = userData.data;
      console.log('Lista de conversas obtida:');
      console.log(this.allConversations);
      console.log('Informações dos participantes:', this.allConversations.allParticipants);
    });
  }

  chatUser(user: User): void {
    this.selectedUser = `${user.firstname} ${user.lastname}`;
    this.clicked = true;
    this.participantId = user.id;
  
      for(let i of this.users){
        // Recuperando o nome do usuario para criar a conversa
         if(i.id == this.userAuthenticated){
             this.loggedUserName = i.firstname;
             break;
         } 
      }
          // Verificando se a conversa ja existe ou nao
        for (let c of this.allConversations.allConversations){

             if((c.title === `${this.loggedUserName}${user.firstname}`) || 
               (c.title === `${this.loggedUserName}${user.firstname}`))  {
                   
                  this.exist = true;
                  break;
                    
               } 
               else
               this.exist = false;
        }
           
        // Quando a conversa nao existe deve-se  criar uma conversa
           if(this.exist != true){
            
            //Preenchendo o Objecto de  Conversas para Salvar
            const userConversation: ConversationModel = {
              id: 0,
              title: `${this.loggedUserName}${user.firstname}`,
              createdAt: '',
              status: true
            }

            const participant1: Participant = {
             
             userId: this.userAuthenticated,
             conversationId: this.userContent.conversationId,
             status: true
            }
            
             const participant2: Participant = {
             
             userId: this.participantId,
             conversationId: this.userContent.conversationId,
             status: true
            }

              //Criando uma conversa e adicionando Participants
              this.SaveConversations(userConversation);
              this.AddParticipants(participant1);
              this.AddParticipants(participant2);
              
           }
           else
           console.log('Ja existe!');
      
    this.getUserContent(this.userAuthenticated, this.participantId);
  }

  getUserContent(userId: number, participantId: number): void {
    this.userService.getUserContent(userId, participantId).subscribe(
      (data) => {
        this.userContent = data.data;
        console.log('Conteúdo do usuário obtido:', this.userContent);
  
        // Criar um array combinado de mensagens e documentos
        let combinedContent: Array<{data: Document_or_Message}> = [];

       
        // Adicionar todas as mensagens ao array combinado
        if (this.userContent && this.userContent.messages.length > 0) {
          this.userContent.messages.forEach(message => {

             this.messDoc = {
                
              id: message.id,
              content_or_FileName: message.content,
              sentAt_or_UploadedAt: message.sentAt,
              idConversation: message.idConversation,
              status: message.status,
              userId: message.userId,
              type: 'message'
              

            };
    
            combinedContent.push({data: this.messDoc});

          });
        }
  
        // Adicionar todos os documentos ao array combinado
        if (this.userContent && this.userContent.documents.length > 0) {
          this.userContent.documents.forEach(document => {

            
            this.messDoc = {
                
              id: document.id,
              content_or_FileName: document.fileName,
              sentAt_or_UploadedAt: document.uploadedAt,
              idConversation: document.idConversation,
              status: document.status,
              userId: document.userId,
              type: 'document'
              

            };
            
            combinedContent.push({data: this.messDoc});
          });
        }
  
        // Ordenar o array combinado por data de envio ou upload
        combinedContent.sort((a, b) => {
          let dateA: string | undefined;
          let dateB: string | undefined;  
  
          if (a.data.type === 'message') {
            dateA = a.data.sentAt_or_UploadedAt;
          } else if (a.data.type === 'document') {
            dateA = a.data.sentAt_or_UploadedAt;
          }
  
          if (b.data.type === 'message') {
            dateB = b.data.sentAt_or_UploadedAt;
          } else if (b.data.type === 'document') {
            dateB = b.data.sentAt_or_UploadedAt;
          }
  
          // Converter as datas para objetos Date e comparar
          if (dateA && dateB) {
            return new Date(dateA).getTime() - new Date(dateB).getTime();
          } else {
            return 0; // Em caso de datas indefinidas, considerar como igual
          }
        });
  
        console.log('Conteúdo combinado e organizado:', combinedContent);
        this.userContent.content = combinedContent;
        
        
      },
      error => {
        console.error('Erro ao obter conteúdo do usuário:', error);
      }
    );
  }
  

  search(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value.toLowerCase();

    this.users = this.allUsers.filter(user => {
      return (user.firstname.toLowerCase().includes(value)) || (user.lastname.toLowerCase().includes(value));
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.messageForm.invalid) {
      console.log('Formulário inválido. Verifique os campos.');
      return;
    }

    const messageData: Message = {
      id: 0,
      content: this.messageForm.get('userMessage')!.value,
      sentAt: new Date().toISOString(),
      idConversation: this.messageForm.get('conversationId')!.value || this.userContent?.conversationId || 0,
      status: true,
      userId: this.messageForm.get('userId')!.value || this.userAuthenticated || 0
    };

    if (!this.selectedFile && !messageData.content) {
      console.log('Preencha a mensagem ou selecione um arquivo para enviar.');
      return;
    }

    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('conversationId', messageData.idConversation.toString());
      formData.append('userId', messageData.userId.toString());

      this.userService.UserMessage(messageData).subscribe(
        (messageResponse) => {
          console.log('Mensagem enviada com sucesso!', messageResponse);

          this.userService.uploadDocument(formData).subscribe(
            (documentResponse) => {
              console.log('Documento enviado com sucesso!', documentResponse);
              this.getUserContent(this.userAuthenticated, this.participantId);
              this.messageForm.reset();
              this.selectedFile = null;
            },
            (documentError) => {
              console.error('Erro ao enviar documento:', documentError);
              alert('Erro ao enviar documento. Verifique o console para mais detalhes.');
            }
          );
        },
        (messageError) => {
          console.error('Erro ao enviar mensagem:', messageError);
        }
      );
    } else {
      this.userService.UserMessage(messageData).subscribe(
        (messageResponse) => {
          console.log('Mensagem enviada com sucesso!', messageResponse);
          this.getUserContent(this.userAuthenticated, this.participantId);
          this.messageForm.reset();
        },
        (messageError) => {
          console.error('Erro ao enviar mensagem:', messageError);
        }
      );
    }
  }

  SaveConversations(userConversation: ConversationModel): void {
    this.userService.CreateConversation(userConversation).subscribe(
      (response) => {
        console.log('Conversa criada com sucesso');
        console.log(response.data);
      },
      (error) => {
        console.error('Erro ao criar conversa:', error);
      }
    );
  }

  AddParticipants(participant: Participant): void{
    
    this.userService.AddParticipants(participant).subscribe(
      (response) => {
        console.log('Participante adicionado com sucesso');
        console.log(response.data);
      },
      (error) => {
        console.error('Erro ao criar participant:', error);
      }
    );
  }
}
