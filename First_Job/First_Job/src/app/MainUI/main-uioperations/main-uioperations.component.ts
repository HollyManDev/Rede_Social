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
import { MatDialog } from '@angular/material/dialog';
import { NewGroupComponent } from '../CreateGroup/new-group/new-group.component';


@Component({
  selector: 'app-main-uioperations',
  templateUrl: './main-uioperations.component.html',
  styleUrls: ['./main-uioperations.component.scss']
})
export class MainUIOperationsComponent implements OnInit {
  userContent!: UserContent; 
  userContent1!: UserContent; 
  users: User[] = [];
  allUsers: User[] = [];
  availableNewChat: User[] = [];
  chatWith: User[] = [];
  allConversations!: UsersConversationsParticipants ;
  selectedUser = '';
  loggedUserName = '';
  fileName = '';
  fileId = 0;
  exist = false; 
  clicked = false;
  userAuthenticated = 0;
  selectedFile: File | null = null;
  participantId = 0;
  messageForm!: FormGroup;
  messDoc!: Document_or_Message; 
  controlChats: boolean | string = false;
  newChatId: number = 0;

  constructor(private userService: UserServiceService, public dialog: MatDialog) {}

  
  
  ngOnInit(): void {
    this.messageForm = new FormGroup({
      userMessage: new FormControl('', Validators.required),
      conversationId: new FormControl(0),
      userId: new FormControl(0)
    });

    this.userAuthenticated = this.userService.GetUserAuthenticated();

    this.userService.GetUsers().subscribe(userData => {

      this.allUsers = userData.data;
      this.users = this.allUsers.filter(user => user.id !== this.userAuthenticated);
      this.allUsers = this.users;
    

    });
    this. GetAllMyChats();
  }

  openModal(): void {

    const dialogRef = this.dialog.open(NewGroupComponent, {
      height:'50%',
        width: '45%',
        disableClose: true,
    });

    
    dialogRef.afterClosed().subscribe(result => {
      console.log('O modal foi fechado. Resultado:', result);
      // Aqui você pode realizar ações com base no resultado do modal
    });
  }

  newChat(): void{
     this.controlChats = true;
  }

  myChat(): void{
   
    this. GetAllMyChats();
    this.controlChats = 'myChats';
  }

  chatUser(user: User): void {

    this.participantId = user.id;
    this.selectedUser = `${user.firstname} ${user.lastname}`;
    this.clicked = true;

     // Encontrar o nome do usuário logado
     for (let i of this.allUsers) {
      if (i.id === this.userAuthenticated) {
        this.loggedUserName = i.firstname;
        break;
      }
    }
     // Verificar se a conversa já 
     
     this.exist = this.checkConversationExists(user);

     if (this.exist == false) {

       // Se a conversa não existe, criar uma nova
       if(user){
        this.createConversation(user);
       }   
     
     } else {
       console.log('Conversa já existe!');
     }

    this.getUserContent(this.userAuthenticated, this.participantId);
  }
  checkConversationExists(user: User): boolean {
    this.exist = false; // Inicializa a variável exist
  
    // Verifica se há participantes carregados
    if (this.allConversations && this.chatWith && this.chatWith.length > 0) {
      // Verifica se a conversa já existe com base nos critérios definidos
      for (let p of this.chatWith) {
        if (p.id === this.userAuthenticated || p.id === this.participantId) {
          for (let p1 of this.chatWith) {
            if (`${this.loggedUserName}${user.firstname}` === `${p.firstname}${p1.firstname}` || 
                `${this.loggedUserName}${user.firstname}` === `${p1.firstname}${p.firstname}`) {
              this.exist = true;
              break;
            }
          }
          if (this.exist == true) {
            break;
          }
        }
      }
    }
    
    return this.exist;
  }
  
  createConversation(user: User): void {
    // Criar objeto de conversa
    const userConversation: ConversationModel = {
      id: 0,
      title: `${this.loggedUserName}${user.firstname}`,
      createdAt: new Date().toISOString(),
      status: true
    };

    // Salvar a conversa
    if(userConversation){
      this.SaveConversations(userConversation);
    }
   
  }

  getUserContent(userId: number, participantId: number): void {
    this.userService.getUserContent(userId, participantId).subscribe(
      (data) => {
        this.userContent = data.data;
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
            if (this.userContent) {
            this.userContent.content = combinedContent;
            this.userContent1.content = combinedContent;
          } else {
            console.error('this.userContent is null or undefined. Unable to set content.');
          }

        
      },
      error => {
        console.error('Erro ao obter conteúdo do usuário:', error);
      }
    );
  }
  

  search(event: Event): void {

    this.controlChats = '';
    this.controlChats = 'searching';

    const target = event.target as HTMLInputElement;
    const value = target.value.toLowerCase();

    this.users = this.allUsers.filter(user => {
      return (user.firstname.toLowerCase().includes(value)) || (user.lastname.toLowerCase().includes(value));
    });
  }
   
  
  searchDoc(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value.toLowerCase();

    this.userContent.content = this.userContent1.content.filter(doc => {
      return (doc.data.content_or_FileName.toLowerCase().includes(value));
    });
  }

  onFileSelected(event: any): void {   
    this.selectedFile = event.target.files[0];
  }

 
  //Salvar Menssagem 
  onSubmit(): void {
    if (this.messageForm.invalid) {
      console.log('Formulário inválido. Verifique os campos.');
      return;
    }
  
    // Criar objeto de mensagem
    const messageData: Message = {
      id: 0,
      content: this.messageForm.get('userMessage')!.value,
      sentAt: new Date().toISOString(),
      idConversation: this.messageForm.get('conversationId')!.value || this.userContent?.conversationId || this.newChatId,
      status: true,
      userId: this.messageForm.get('userId')!.value || this.userAuthenticated || 0
    };
  
    // Verificar se há um arquivo selecionado para upload
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('conversationId', this.userContent?.conversationId.toString());
      formData.append('userId', this.userAuthenticated.toString());
  
      // Enviar o documento
      this.userService.uploadDocument(formData).subscribe(
        (documentResponse) => {
          console.log('Documento enviado com sucesso!', documentResponse);
  
          // Após enviar o documento, enviar também a mensagem
          this.userService.UserMessage(messageData).subscribe(
            (messageResponse) => {
              console.log('Mensagem enviada com sucesso!', messageResponse);
              this.getUserContent(this.userAuthenticated, this.participantId);
              this.messageForm.reset();
              this.selectedFile = null; // Limpar o arquivo selecionado após o envio
  
             
            },
            (messageError) => {
              console.error('Erro ao enviar mensagem:', messageError);
            }
          );
        },
        (documentError) => {
          console.error('Erro ao enviar documento:', documentError);
          alert('Erro ao enviar documento. Verifique o console para mais detalhes.');
        }
      );
    } else {
      // Se não houver arquivo selecionado, enviar apenas a mensagem
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
  
  // Processo de salvar uma conversa
  SaveConversations(userConversation: ConversationModel): void {
    this.userService.CreateConversation(userConversation).subscribe(
      (response) => {
        
        //Pegando o id da novca conversa
          this.newChatId = response.data

        // Uma vez que em uma conversa  temos de ter no minimo duas pessoas envolvidas, segue abaixo os objectos:
        const participant1: Participant = {
             
          userId: this.userAuthenticated,
          conversationId: response.data,
          status: true
         }
         
          const participant2: Participant = {
          
          userId: this.participantId,
          conversationId: response.data,
          status: true
         }

         if(participant1.conversationId != 0 && participant1.userId  && participant2.conversationId != 0 && participant2.userId ){
          this.AddParticipants(participant1);
          this.AddParticipants(participant2);
          
          participant1.conversationId = 0;
          participant1.userId = 0;
          participant2.conversationId = 0;
          participant2.userId = 0;
          
         }
              //Buscando os amigos
              
         this. GetAllMyChats();

      },
      (error) => {
        console.error('Erro ao criar conversa:', error);
      }
    );
  }

  // processso de adicionar participant em uma conversa
  AddParticipants(participant: Participant): void{
    
    this.userService.AddParticipants(participant).subscribe(
      (response) => {
       
        console.log(response.data);
      },
      (error) => {
        console.error('Erro ao criar participant:', error);
      }
    );
  }
  
  getDoc(item: Document_or_Message): void{
     
    this.fileName = item.content_or_FileName;
    this.fileId = item.id;  
    // Chamando para doawload!
    if(this.fileId){
      this.downloadDocument(this.fileId);
    }
    
  }
  downloadDocument(documentId: number): void {
    this.userService.downloadDocument(documentId).subscribe(
      (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = this.fileName; // Nome do arquivo que será baixado
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error => {
        console.error('Error downloading document:', error);
        
      }
    );
  }

    GetAllMyChats(): void{
      this.userService.GetConversations(this.userAuthenticated).subscribe(
        userData => {
  
          this.allConversations = userData.data;
          //Filtrando users que não seja o que autenticou
          this.chatWith = this.allConversations.allParticipants.filter(user => user.id !== this.userAuthenticated);
  
          // aqui é feito um filtro  para pegar os users que não tenho conversa com eles!
          this.availableNewChat = this.users.filter(user =>
            !this.chatWith.some(chatUser => chatUser.id === user.id)
          );
  
        },
        error => {
          console.error('Erro ao obter conversas:', error);
        }
      );
  
    }
}
