import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserServiceService } from './../../Service/user-service.service';
import { User } from 'src/app/Models/UserModel';
import { UserContent } from './../../Models/UserContentModel';
import { ChangeDetectorRef } from '@angular/core';
import { Message } from 'src/app/Models/MessageModel';
import { Documents } from 'src/app/Models/Document';
import { ConversationModel } from './../../Models/Conversation';
import { UsersConversationsParticipants } from './../../Models/usersConversationsParticipants';
import { Document_or_Message } from 'src/app/Models/Document_or_Message';
import { Participant } from 'src/app/Models/ConversationParticipant';
import { MatDialog } from '@angular/material/dialog';
import { NewGroupComponent } from '../CreateGroup/new-group/new-group.component';
import Groups from 'src/app/Models/Group';
import { EditionComponent } from '../EditMessage/edition/edition.component';
import { ForwardComponent } from '../Foward/forward/forward.component';


@Component({
  selector: 'app-main-uioperations',
  templateUrl: './main-uioperations.component.html',
  styleUrls: ['./main-uioperations.component.scss']
})
export class MainUIOperationsComponent implements OnInit {
 
  users: User[] = [];
  allUsers: User[] = [];
  allUsers1: User[] = [];
  availableNewChat: User[] = [];
  conversationShow: ConversationModel [] = [];
  chatWith: User[] = [];
  allConversations!: UsersConversationsParticipants ;
  selectedUser = '';
  newConvFriend = '';
  messageVerify = '';
  loggedUserName = '';
  status: boolean = false;
  fileName = '';
  fileName1 = 'documnetTeste.teste';
  fileId = 0;
  exist: any ; 
  clicked = false;
  userAuthenticated = 0;
  selectedFile: File | null = null;
  participantId = 0;
  messageForm!: FormGroup;
  messDoc!: Document_or_Message; 
  controlChats: boolean | string = false;
  newChatId: number = 0;
  
  userContent: UserContent = {
    userId: 0, 
    conversationId: 0, 
    messages: [],
    documents: [],
    content: []
  };
  
  userContent1: Groups = {
  
    userId: 0, 
    conversationId: 0, 
    messages: [],
    documents: [],
    content: []
  };
   

  constructor(private userService: UserServiceService, public dialog: MatDialog, private changeDetectorRef: ChangeDetectorRef
  )
   {}

  ngOnInit(): void {
    this.messageForm = new FormGroup({
      userMessage: new FormControl('', Validators.required),
      conversationId: new FormControl(0),
      userId: new FormControl(0)
    });

    this.userAuthenticated = this.userService.GetUserAuthenticated();

    this.userService.GetUsers().subscribe(userData => {

        if(userData.data){
          this.allUsers = userData.data;
          this.allUsers1 = userData.data;
          this.users = this.allUsers.filter(user => user.id !== this.userAuthenticated);
          this.allUsers = this.users;
        }
    
    

    });
    this. GetAllMyChats();

  }

  onMouseEnter(i : Document_or_Message ): void{

    let docs = document.getElementById('docOther');

    if(docs && i.doawloaded === true){
         docs.style.display = 'flex'
    }
     
  }

  DeleteMessage_Document(i: Document_or_Message): void{
   
   if(i.type === 'message'){
   
    const messageData: Message = {  
      id: i.id,
      content: i.content_or_FileName,
      sentAt: i.sentAt_or_UploadedAt,
      idConversation: i.idConversation,
      status: false,
      userId: i.userId,
      seen: i.doawloaded
    }

    this.userService.DeleteMessage(messageData).subscribe(
      (messageResponse) => {
        if (messageResponse.data) {
          
         if(this.messageVerify === 'normal'){
          this.userContent.content = this.userContent.content.filter(m => m.data.id !== messageResponse.data.id && m.data.status === true)
         }
         else{
            if(this.messageVerify === 'grupo'){
              this.userContent1.content = this.userContent1.content.filter(m => m.data.id !== messageResponse.data.id && m.data.status === true)
            }
         }
         
          
        }
      },
      (messageError) => {
        console.error('Erro ao atualizar mensagens:', messageError);
      }
    );
  }
  else{

    if(i.type === 'document'){
      const docData: Documents = {  
        id: i.id,
        fileName: i.content_or_FileName,
        uploadedAt: i.sentAt_or_UploadedAt,
        idConversation: i.idConversation,
        status: false,
        userId: i.userId,
        doawloaded: i.doawloaded
      }
  
      this.userService.DeleteDocument(docData).subscribe(
        (messageResponse) => {
          if (messageResponse.data) {
            
         
            if(this.messageVerify === 'normal'){
              this.userContent.content = this.userContent.content.filter(m => m.data.id !== messageResponse.data.id && m.data.status === true)
             }
             else{
                if(this.messageVerify === 'group'){
                  this.userContent1.content = this.userContent1.content.filter(m => m.data.id !== messageResponse.data.id && m.data.status === true)
                }
             }
             
            
          }
        },
        (messageError) => {
          console.error('Erro ao atualizar mensagens:', messageError);
        }
      );
    }
  }
  
   
  }

  onMouseLeave(){
    let docs = document.getElementById('docOther');

    if(docs){
         docs.style.display = 'none'
    }
  }
  openModal(): void {

    const dialogRef = this.dialog.open(NewGroupComponent, {
      height:'80%',
        width: '50%',
        disableClose: true,
    });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log('O modal foi fechado. Resultado:', result);
      
      // Aqui você pode realizar ações com base no resultado do modal
      this. GetAllMyChats();
    });

  }
  openModalFoward(i: Document_or_Message): void {

    const dialogRef = this.dialog.open(ForwardComponent, {
      height:'80%',
        width: '30%',
        disableClose: true,
    });
    
     i.idConversation = this.userContent.conversationId
    this.userService.SetMessageEdition(i);

    dialogRef.afterClosed().subscribe(result => {
      console.log('O modal foi fechado. Resultado:', result);
      // Aqui você pode realizar ações com base no resultado do modal
         const user : User = this.userService.GetUserEdition();
         if(user){
          this.chatUser(user);
         }
        
    });

  }
  openModalEdit(message: Document_or_Message): void {

    const dialogRef = this.dialog.open(EditionComponent, {
      height: '40%',
      width: '30%',
      disableClose: true,
    });

    //Guardando a Menssagem
    this.userService.SetMessageEdition(message);

    dialogRef.afterClosed().subscribe(result => {
      
      //Recuperando logo que fechar a janela
    this.messDoc = this.userService.GetMessageEdition();
   
       if(this.messageVerify === 'normal'){
             
            //Removendo uma para ter outra
            this.userContent.content = this.userContent.content.filter(m => m.data.id !== this.messDoc.id );
              
            //actualizando
            this.userContent.content.push({data: this.messDoc});
       }
       else{
            
           if(this.messageVerify === 'group'){

            //Removendo uma para ter outra
            this.userContent1.content = this.userContent1.content.filter(m => m.data.id !== this.messDoc.id );
              
            //actualizando
            this.userContent1.content.push({data: this.messDoc});

           }
       }

    });
  }

  newChat(): void{
     this.controlChats = true;
     this.GetAllMyChats();
  }
  
  group(): void{
    this.controlChats = 'group';
 }

  myChat(): void{ 
    this.controlChats = 'myChats';
  }

  getGroup(c: ConversationModel): void{
    this.messageVerify = 'group'
    this.clicked = true;
    this.selectedUser = c.title
    this.getGroupContent(c.id);
  }

  chatUser(user: User): void {
    
    this.messageVerify = 'normal'
    this.participantId = user.id;
    this.selectedUser = `${user.firstname} ${user.lastname}`;
    this.newConvFriend = user.firstname
    this.clicked = true;

     // Encontrar o nome do usuário logado
     for (let i of this.allUsers1) {
      if (i.id === this.userAuthenticated) {
        this.loggedUserName = i.firstname;
        break;
      }
    }
     // Verificar se a conversa já 
     
     this.exist = this.checkConversationExists( this.newConvFriend );

     if (this.exist === null || this.exist === undefined) {

       // Se a conversa não existe, criar uma nova
        this.createConversation( this.newConvFriend);   
     
     } else {
       console.log('Conversa já existe!');
     }


    this.getUserContent(this.userAuthenticated, this.participantId);
  }

  checkConversationExists(user: string): boolean {
  
    // Verifica se há participantes carregados
    if (this.allConversations.allConversation.length > 0) {
      // Verifica se a conversa já existe com base nos critérios definidos
          this.exist = this.allConversations.allConversation.find(c => c.title === `${this.loggedUserName}${user}` );   
    }
    
    return this.exist;
  }
  
  createConversation(user: string): void {
    // Criar objeto de conversa
    const userConversation: ConversationModel = {
      id: 0,
      title: `${this.loggedUserName}${user}`,
      createdAt: new Date().toISOString(),
      status: true,
      type: 'normal'
    };
       
    // Salvar a conversa
    if(userConversation){
      
      this.SaveConversations(userConversation);
    }
   
  }

  // getUserContent(userId: number, participantId: number): void {
  //   this.userService.getUserContent(userId, participantId).subscribe(
  //     (data) => {
        
  //       if(data.data){
  //         this.userContent = data.data;
  //         this.userContent1.content= [];
  //         const total = this.userContent.messages.filter(m => m.seen === false && m.userId === this.participantId);
 
  //         if(total.length > 0){
              
  //               const  messageData: Message = {
  //                id: 0,
  //                content: '',
  //                sentAt: new Date().toISOString(),
  //                idConversation: data.data.conversationId,
  //                status: false,
  //                userId: this.participantId,
  //                seen: false
  //               };
              
  //               this.userService.UpdateStatus(messageData).subscribe(
  //                (messageResponse) => {
                 
  //                            if(messageResponse.data){
  //                             console.log(messageResponse, 'retornei isto');
 
  //                             this.userContent.messages.push( messageResponse.data);
                              
  //                            }
  //                },
  //                (messageError) => {
  //                  console.error('Erro ao actualizar menssages:', messageError);
  //                }
  //              );
                
  //         }
  //       }
       
       
  //       //Metodo Responsavel por ordenar os dcumentos
  //     this.orderingMessages_Docs(this.userContent)
      
  //     },
  //     error => {
  //       console.error('Erro ao obter conteúdo do usuário:', error);
  //     }
  //   );
  // }
  // orderingMessages_Docs(usercontent: UserContent){
  
  //     // Criar um array combinado de mensagens e documentos
      
  //   let combinedContent: Array<{data: Document_or_Message}> = [];
    
  // // Adicionar todas as mensagens ao array combinado
  // if (this.userContent && this.userContent.messages.length > 0) {
  //   this.userContent.messages.forEach(message => {

  //      this.messDoc = {
          
  //       id: message.id,
  //       content_or_FileName: message.content,
  //       sentAt_or_UploadedAt: message.sentAt,
  //       idConversation: message.idConversation,
  //       status: message.status,
  //       userId: message.userId,
  //       doawloaded: message.seen,
  //       type: 'message'
        

  //     };

  //     combinedContent.push({data: this.messDoc});

  //   });
  // }

  // // Adicionar todos os documentos ao array combinado
  // if (this.userContent && this.userContent.documents.length > 0) {
  //   this.userContent.documents.forEach(document => {

      
  //     this.messDoc = {
          
  //       id: document.id,
  //       content_or_FileName: document.fileName,
  //       sentAt_or_UploadedAt: document.uploadedAt,
  //       idConversation: document.idConversation,
  //       status: document.status,
  //       userId: document.userId,
  //       doawloaded: document.doawloaded,
  //       type: 'document'  

  //     };
      
  //     combinedContent.push({data: this.messDoc});
  //   });
  // }

  // // Ordenar o array combinado por data de envio ou upload
  // combinedContent.sort((a, b) => {
  //   let dateA: string | undefined;
  //   let dateB: string | undefined;  

  //   if (a.data.type === 'message') {
  //     dateA = a.data.sentAt_or_UploadedAt;
  //   } else if (a.data.type === 'document') {
  //     dateA = a.data.sentAt_or_UploadedAt;
  //   }

  //   if (b.data.type === 'message') {
  //     dateB = b.data.sentAt_or_UploadedAt;
  //   } else if (b.data.type === 'document') {
  //     dateB = b.data.sentAt_or_UploadedAt;
  //   }

  //   // Converter as datas para objetos Date e comparar
  //   if (dateA && dateB) {
  //     return new Date(dateA).getTime() - new Date(dateB).getTime();
  //   } else {
  //     return 0; // Em caso de datas indefinidas, considerar como igual
  //   }
  // });
  //     if (this.userContent) {
  //     this.userContent.content = combinedContent;
      
  //   } else {
  //     if(this.userContent1){

  //       //this.userContent1.content = combinedContent;
  //     }
  //   }
  
  // }
  getUserContent(userId: number, participantId: number): void {
    this.userService.getUserContent(userId, participantId).subscribe(
      (data) => {
        if (data.data) {
          this.userContent = data.data;
          this.userContent1.content = [];
  
          // Atualizar status das mensagens não lidas
          const unreadMessages = this.userContent.messages.filter(m => !m.seen && m.userId === this.participantId);
  
          if (unreadMessages.length > 0) {
            const messageData: Message = {
              id: 0,
              content: '',
              sentAt: new Date().toISOString(),
              idConversation: this.userContent.conversationId,
              status: false,
              userId: this.participantId,
              seen: false
            };
  
            this.userService.UpdateStatus(messageData).subscribe(
              (messageResponse) => {
                if (messageResponse.data) {
                  console.log('Status atualizado com sucesso:', messageResponse);
                  this.userContent.messages.push(messageResponse.data);
                }
              },
              (messageError) => {
                console.error('Erro ao atualizar mensagens:', messageError);
              }
            );
          }
  
          // Ordenar mensagens e documentos
          this.orderingMessages_Docs(this.userContent);
        }
      },
      (error) => {
        console.error('Erro ao obter conteúdo do usuário:', error);
      }
    );
  }
  
  
  orderingMessages_Docs(userContent: UserContent): void {
    let combinedContent: Array<{ data: Document_or_Message }> = [];
  
    // Adicionar todas as mensagens ao array combinado
    if (userContent && userContent.messages.length > 0 ) {
      userContent.messages.forEach(message => {
        const messDoc: Document_or_Message = {
          id: message.id,
          content_or_FileName: message.content,
          sentAt_or_UploadedAt: message.sentAt,
          idConversation: message.idConversation,
          status: message.status,
          userId: message.userId,
          doawloaded: message.seen,
          type: 'message'
        };
  
        combinedContent.push({ data: messDoc });
      });
    }
  
    // Adicionar todos os documentos ao array combinado
    if (userContent && userContent.documents.length > 0) {
      userContent.documents.forEach(document => {
        const messDoc: Document_or_Message = {
          id: document.id,
          content_or_FileName: document.fileName,
          sentAt_or_UploadedAt: document.uploadedAt,
          idConversation: document.idConversation,
          status: document.status,
          userId: document.userId,
          doawloaded: document.doawloaded,
          type: 'document'
        };
  
        combinedContent.push({ data: messDoc });
      });
    }
  
    // Ordenar o array combinado por data de envio ou upload
    combinedContent.sort((a, b) => {
      let dateA = a.data.sentAt_or_UploadedAt;
      let dateB = b.data.sentAt_or_UploadedAt;
  
      // Converter as datas para objetos Date e comparar
      if (dateA && dateB) {
        return new Date(dateA).getTime() - new Date(dateB).getTime();
      } else {
        return 0; // Em caso de datas indefinidas, considerar como igual
      }
    });
  
    // Atualizar o conteúdo
    if (this.messageVerify === 'normal') {
      userContent.content = combinedContent;
    } else if (this.messageVerify === 'group') {
      // Atualizar conteúdo alternativo se necessário
      this.userContent1.content = combinedContent;
    }
  
    console.log('Conteúdo ordenado:', combinedContent);
  }  
  
   getGroupContent(group: number): void{
    this.userService.GetGroupConversations(group).subscribe(
      (data) => {

            if(data.data){
              this.userContent1 = data.data;
              this.userContent.content= [];
              
          //             // Atualizar status das mensagens não lidas
          const unreadMessages = this.userContent1.messages.filter(m => !m.seen && m.userId !== this.userAuthenticated);
  
          if (unreadMessages.length > 0) {
            const messageData: Message = {
              id: 0,
              content: '',
              sentAt: new Date().toISOString(),
              idConversation: this.userContent1.conversationId,
              status: false,
              userId: this.userAuthenticated,
              seen: false
            };
  
            this.userService.UpdateStatusGroup(messageData).subscribe(
              (messageResponse) => {
                if (messageResponse.data) {
                  console.log('Status atualizado com sucesso:', messageResponse);
                  this.userContent.messages.push(messageResponse.data);
                }
              },
              (messageError) => {
                console.error('Erro ao atualizar mensagens:', messageError);
              }
            );
          }
  
          // Ordenar mensagens e documentos
          this.orderingMessages_Docs(this.userContent1);
            }
        

      });
   }

  getSenderInMessageGroup(UserId: number): string {
    const user = this.allUsers.find(u => u.id === UserId);
    return user ? `~ ~ ${user?.firstname} ${user?.lastname}` : 'Unknown User';
  }

  search(event: Event): void {

    this.controlChats = '';
    this.controlChats = 'searching';

    const target = event.target as HTMLInputElement;
    const value = target.value.toLowerCase();

    this.users = this.allUsers.filter(user => {
      return (user.firstname.toLowerCase().includes(value)) || (user.lastname.toLowerCase().includes(value));
    });

    if(value === ''){
         this.users = [];
         this.controlChats = 'myChats'
    }

  }

  onFileSelected(event: any): void {   
    this.selectedFile = event.target.files[0];

    const fileselected = document.getElementById('fileName');
    

    if(this.selectedFile){
      
      if(fileselected){
      fileselected.style.opacity = '1';
      this.fileName1 = this.selectedFile.name
      }
     
    }
    
  }
 
// // Salvar Mensagem e/ou Documento
// onSubmit(): void {
//   // Se o formulário de mensagem estiver inválido, mas há um documento, enviar o documento mesmo assim

//   //Verifica se esta em um grupo ou conversa normal

//   if(this.messageVerify === 'normal'){
        
//     if (this.selectedFile && this.messageForm.invalid) {
//       console.log('Formulário inválido, mas documento será enviado.');
//     } else if (this.messageForm.invalid && !this.selectedFile) {
//       console.log('Formulário inválido. Verifique os campos.');
//       return;
//     }
  
//     // Criar objeto de mensagem
//     const messageData: Message = {
//       id: 0,
//       content: this.messageForm.get('userMessage')?.value || '',
//       sentAt: new Date().toISOString(),
//       idConversation: this.messageForm.get('conversationId')?.value || this.userContent?.conversationId || this.newChatId,
//       status: true,
//       userId: this.messageForm.get('userId')?.value || this.userAuthenticated || 0,
//       seen: false
//     };
  
//     // Se houver um arquivo selecionado, enviar o documento
//     if (this.selectedFile) {
//       const formData = new FormData();
//       formData.append('file', this.selectedFile);
//       formData.append('conversationId', this.userContent?.conversationId.toString() || '');
//       formData.append('userId', this.userAuthenticated.toString() || '');
  
//       // Enviar o documento
//       this.userService.uploadDocument(formData).subscribe(
//         (documentResponse) => {

//           this.fileName1 = '';
//           // Se houver uma mensagem, enviá-la após o envio do documento
//           if (messageData.content) {
//               this.userService.UserMessage(messageData).subscribe(
//               (response) => {
               
//                 if (response.data) {
//                   // Criação do objeto Document_or_Message
//                   const messDoc: Document_or_Message = {
//                     id: response.data.id,
//                     content_or_FileName: response.data.content,
//                     sentAt_or_UploadedAt: response.data.sentAt,
//                     idConversation: response.data.idConversation,
//                     status: response.data.status,
//                     userId: response.data.userId,
//                     doawloaded: response.data.seen,
//                     type: 'message'
//                   };
            
//                   // Atualização da referência do userContent
                 
//                     this.userContent.content.push( { data: messDoc })
                
//                   // Optional: Forçar a detecção de mudanças se necessário
//                   this.changeDetectorRef.detectChanges();
            
//                   this.clicked =true
//                   this.messageVerify = 'normal'
                 
//                   // Resetar o formulário
//                   this.messageForm.reset();
//                 } else {
//                   console.error('Resposta não contém dados esperados:', response);
//                 }
//               },
//               (messageError) => {
//                 console.error('Erro ao enviar mensagem:', messageError);
//               }
//             );
//           } else {
//             // Se não houver mensagem, apenas limpar o estado
//             this.getUserContent(this.userAuthenticated, this.participantId);
//             this.messageForm.reset();
//             this.selectedFile = null; // Limpar o arquivo selecionado após o envio
//           }
//         },
//         (documentError) => {
//           console.error('Erro ao enviar documento:', documentError);
//           alert('Erro ao enviar documento. Verifique o console para mais detalhes.');
//         }
//       );
//     } else {
//       // Se não houver arquivo selecionado, enviar apenas a mensagem se houver
//       if (messageData.content) {
//         this.userService.UserMessage(messageData).subscribe(
//           (response) => {
           
//             if (response.data) {
//               // Criação do objeto Document_or_Message
//               const messDoc: Document_or_Message = {
//                 id: response.data.id,
//                 content_or_FileName: response.data.content,
//                 sentAt_or_UploadedAt: response.data.sentAt,
//                 idConversation: response.data.idConversation,
//                 status: response.data.status,
//                 userId: response.data.userId,
//                 doawloaded: response.data.seen,
//                 type: 'message'
//               };
        
//               // Atualização da referência do userContent
             
//                 this.userContent.content.push( { data: messDoc })
            
//               // Optional: Forçar a detecção de mudanças se necessário
//               this.changeDetectorRef.detectChanges();
        
//               this.clicked =true
//               this.messageVerify = 'normal'
             
//               // Resetar o formulário
//               this.messageForm.reset();
//             } else {
//               console.error('Resposta não contém dados esperados:', response);
//             }
//           },
//           (messageError) => {
//             console.error('Erro ao enviar mensagem:', messageError);
//           }
//         );
        
      
//       } else {
//         console.log('Nenhum arquivo selecionado e nenhuma mensagem para enviar.');
//       }
//     }
//   }
//   else{

//     if(this.messageVerify === 'group'){

//       if (this.selectedFile && this.messageForm.invalid) {
//         console.log('Formulário inválido, mas documento será enviado.');
//       } else if (this.messageForm.invalid) {
//         console.log('Formulário inválido. Verifique os campos.');
//         return;
//       }
    
//       // Criar objeto de mensagem
//       const messageData: Message = {
//         id: 0,
//         content: this.messageForm.get('userMessage')?.value || '',
//         sentAt: new Date().toISOString(),
//         idConversation: this.messageForm.get('conversationId')?.value || this.userContent1?.conversationId,
//         status: true,
//         userId: this.messageForm.get('userId')?.value || this.userAuthenticated,
//         seen: false
//       };
    
//       // Se houver um arquivo selecionado, enviar o documento
//       if (this.selectedFile) {
//         const formData = new FormData();
//         formData.append('file', this.selectedFile);
//         formData.append('conversationId', this.userContent1?.conversationId.toString() || '');
//         formData.append('userId', this.userAuthenticated.toString() || '');
    
//         // Enviar o documento
//         this.userService.uploadDocument(formData).subscribe(
//           (documentResponse) => {
//             this.fileName1 = '';
//             // Se houver uma mensagem, enviá-la após o envio do documento
//             if (messageData.content) {
//               this.userService.UserMessage(messageData).subscribe(
//                 (response) => {
                 
//                   if (response.data) {
//                     // Criação do objeto Document_or_Message
//                     const messDoc: Document_or_Message = {
//                       id: response.data.id,
//                       content_or_FileName: response.data.content,
//                       sentAt_or_UploadedAt: response.data.sentAt,
//                       idConversation: response.data.idConversation,
//                       status: response.data.status,
//                       userId: response.data.userId,
//                       doawloaded: response.data.seen,
//                       type: 'message'
//                     };
              
//                     // Atualização da referência do userContent
                   
//                       this.userContent.content.push( { data: messDoc })
                  
//                     // Optional: Forçar a detecção de mudanças se necessário
//                     this.changeDetectorRef.detectChanges();
              
//                     this.clicked =true
//                     this.messageVerify = 'normal'
                   
//                     // Resetar o formulário
//                     this.messageForm.reset();
//                   } else {
//                     console.error('Resposta não contém dados esperados:', response);
//                   }
//                 },
//                 (messageError) => {
//                   console.error('Erro ao enviar mensagem:', messageError);
//                 }
//               );
//             } else {
//               // Se não houver mensagem, apenas limpar o estado
//               this.getGroupContent(this.userContent1.conversationId);
//               this.messageForm.reset();
//               this.selectedFile = null; // Limpar o arquivo selecionado após o envio
//             }
//           },
//           (documentError) => {
//             console.error('Erro ao enviar documento:', documentError);
//             alert('Erro ao enviar documento. Verifique o console para mais detalhes.');
//           }
//         );
//       } else {
//         // Se não houver arquivo selecionado, enviar apenas a mensagem se houver
//         if (messageData.content) {
//           this.userService.UserMessage(messageData).subscribe(
//             (response) => {
             
//               if (response.data) {
//                 // Criação do objeto Document_or_Message
//                 const messDoc: Document_or_Message = {
//                   id: response.data.id,
//                   content_or_FileName: response.data.content,
//                   sentAt_or_UploadedAt: response.data.sentAt,
//                   idConversation: response.data.idConversation,
//                   status: response.data.status,
//                   userId: response.data.userId,
//                   doawloaded: response.data.seen,
//                   type: 'message'
//                 };
          
//                 // Atualização da referência do userContent
               
//                   this.userContent.content.push( { data: messDoc })
              
//                 // Optional: Forçar a detecção de mudanças se necessário
//                 this.changeDetectorRef.detectChanges();
          
//                 this.clicked =true
//                 this.messageVerify = 'normal'
               
//                 // Resetar o formulário
//                 this.messageForm.reset();
//               } else {
//                 console.error('Resposta não contém dados esperados:', response);
//               }
//             },
//             (messageError) => {
//               console.error('Erro ao enviar mensagem:', messageError);
//             }
//           );
//         } else {
//           console.log('Nenhum arquivo selecionado e nenhuma mensagem para enviar.');
//         }
//       }
//     }

//   }

// }
// onSubmit(): void {
//   // Se o formulário estiver inválido e um arquivo estiver selecionado, envia o documento mesmo assim
//   if (this.messageVerify === 'normal' || this.messageVerify === 'group') {
//     if (this.messageForm.invalid && !this.selectedFile) {
//       console.log('Formulário inválido. Verifique os campos.');
//       return;
//     }

//     // Criar objeto de mensagem
//     const messageData: Message = {
//       id: 0,
//       content: this.messageForm.get('userMessage')?.value || '',
//       sentAt: new Date().toISOString(),
//       idConversation: this.messageForm.get('conversationId')?.value || this.userContent?.conversationId || this.userContent1?.conversationId,
//       status: true,
//       userId: this.messageForm.get('userId')?.value || this.userAuthenticated || 0,
//       seen: false
//     };

//     // Função auxiliar para enviar a mensagem
//     const sendMessage = () => {
//       if (messageData.content) {
//         this.userService.UserMessage(messageData).subscribe(
//           (response) => {
//             if (response.data) {
//               // Criação do objeto Document_or_Message
//               const messDoc: Document_or_Message = {
//                 id: response.data.id,
//                 content_or_FileName: response.data.content,
//                 sentAt_or_UploadedAt: response.data.sentAt,
//                 idConversation: response.data.idConversation,
//                 status: response.data.status,
//                 userId: response.data.userId,
//                 doawloaded: response.data.seen,
//                 type: 'message'
//               };

//               // Atualização da referência do userContent
//               this.userContent = {
//                 ...this.userContent,
//                 content: [...this.userContent.content, { data: messDoc }]
//               };

//               // Forçar a detecção de mudanças se necessário
//               this.changeDetectorRef.detectChanges();

//               this.clicked = true;
//               this.messageVerify = 'normal';

//               // Resetar o formulário e o arquivo selecionado
//               this.messageForm.reset();
//               this.selectedFile = null;
//             } else {
//               console.error('Resposta não contém dados esperados:', response);
//             }
//           },
//           (messageError) => {
//             console.error('Erro ao enviar mensagem:', messageError);
//           }
//         );
//       } else {
//         // Apenas limpar o estado se não houver mensagem
//         this.messageForm.reset();
//         this.selectedFile = null; // Limpar o arquivo selecionado após o envio
//       }
//     };

//     // Se houver um arquivo selecionado, enviar o documento
//     if (this.selectedFile) {
//       const formData = new FormData();
//       formData.append('file', this.selectedFile);
//       formData.append('conversationId', this.userContent?.conversationId?.toString() || this.userContent1?.conversationId?.toString() || '');
//       formData.append('userId', this.userAuthenticated.toString() || '');

//       this.userService.uploadDocument(formData).subscribe(
//         (documentResponse) => {
//           this.fileName1 = '';
//           // Enviar a mensagem após o envio do documento
//           sendMessage();
//         },
//         (documentError) => {
//           console.error('Erro ao enviar documento:', documentError);
//           alert('Erro ao enviar documento. Verifique o console para mais detalhes.');
//         }
//       );
//     } else {
//       // Se não houver arquivo selecionado, enviar apenas a mensagem se houver
//       sendMessage();
//     }
//   }
// }
// onSubmit(): void {
//   // Verifique se o formulário está inválido
//   if (this.messageForm.invalid && !this.selectedFile) {
//     console.log('Formulário inválido. Verifique os campos.');
//     return;
//   }

//   // Criação do objeto de mensagem
//   const messageData: Message = {
//     id: 0,
//     content: this.messageForm.get('userMessage')?.value || '',
//     sentAt: new Date().toISOString(),
//     idConversation: this.messageForm.get('conversationId')?.value || this.userContent?.conversationId || this.userContent1?.conversationId,
//     status: true,
//     userId: this.messageForm.get('userId')?.value || this.userAuthenticated || 0,
//     seen: false
//   };

//   // Função auxiliar para atualizar o conteúdo e forçar a detecção de mudanças
//   const updateContent = (data: Document_or_Message) => {
//     this.userContent = {
//       ...this.userContent,
//       content: [...this.userContent.content, { data }]
//     };
//     this.changeDetectorRef.detectChanges();
//   };

//   // Se houver um arquivo selecionado, envie o documento primeiro
//   if (this.selectedFile) {
//     const formData = new FormData();
//     formData.append('file', this.selectedFile);
//     formData.append('conversationId', this.userContent?.conversationId?.toString() || this.userContent1?.conversationId?.toString() || '');
//     formData.append('userId', this.userAuthenticated.toString() || '');

//     this.userService.uploadDocument(formData).subscribe(
//       (documentResponse) => {
//         this.fileName1 = '';
        
//         // Atualize o conteúdo com a resposta do documento, se aplicável
//         if (documentResponse.data) {
//           const docData: Document_or_Message = {
//             id: documentResponse.data.id,
//             content_or_FileName: documentResponse.data.content,
//             sentAt_or_UploadedAt: documentResponse.data.sentAt,
//             idConversation: documentResponse.data.idConversation,
//             status: documentResponse.data.status,
//             userId: documentResponse.data.userId,
//             doawloaded: documentResponse.data.seen,
//             type: 'document' // Ajuste se necessário
//           };
//           updateContent(docData);
//         }

//         // Enviar a mensagem se houver
//         if (messageData.content) {
//           this.userService.UserMessage(messageData).subscribe(
//             (messageResponse) => {
//               if (messageResponse.data) {
//                 const messDoc: Document_or_Message = {
//                   id: messageResponse.data.id,
//                   content_or_FileName: messageResponse.data.content,
//                   sentAt_or_UploadedAt: messageResponse.data.sentAt,
//                   idConversation: messageResponse.data.idConversation,
//                   status: messageResponse.data.status,
//                   userId: messageResponse.data.userId,
//                   doawloaded: messageResponse.data.seen,
//                   type: 'message'
//                 };
//                 updateContent(messDoc);
//               } else {
//                 console.error('Resposta não contém dados esperados:', messageResponse);
//               }
//             },
//             (messageError) => {
//               console.error('Erro ao enviar mensagem:', messageError);
//             }
//           );
//         } else {
//           // Apenas limpar o estado se não houver mensagem
//           this.messageForm.reset();
//           this.selectedFile = null;
//         }
//       },
//       (documentError) => {
//         console.error('Erro ao enviar documento:', documentError);
//         alert('Erro ao enviar documento. Verifique o console para mais detalhes.');
//       }
//     );
//   } else {
//     // Se não houver arquivo, envie apenas a mensagem se houver
//     if (messageData.content) {
//       this.userService.UserMessage(messageData).subscribe(
//         (response) => {
//           if (response.data) {
//             const messDoc: Document_or_Message = {
//               id: response.data.id,
//               content_or_FileName: response.data.content,
//               sentAt_or_UploadedAt: response.data.sentAt,
//               idConversation: response.data.idConversation,
//               status: response.data.status,
//               userId: response.data.userId,
//               doawloaded: response.data.seen,
//               type: 'message'
//             };
//             updateContent(messDoc);
//           } else {
//             console.error('Resposta não contém dados esperados:', response);
//           }
//         },
//         (messageError) => {
//           console.error('Erro ao enviar mensagem:', messageError);
//         }
//       );
//     } else {
//       console.log('Nenhum arquivo selecionado e nenhuma mensagem para enviar.');
//     }
//   }
// }
// onSubmit(): void {
//   // Se o formulário estiver inválido e nenhum arquivo estiver selecionado, exibir mensagem de erro
//   if (this.messageForm.invalid && !this.selectedFile) {
//     console.log('Formulário inválido. Verifique os campos.');
//     return;
//   }

//   // Criar objeto de mensagem
//   const messageData: Message = {
//     id: 0,
//     content: this.messageForm.get('userMessage')?.value || '',
//     sentAt: new Date().toISOString(),
//     idConversation: this.messageForm.get('conversationId')?.value || this.userContent?.conversationId || this.userContent1?.conversationId,
//     status: true,
//     userId: this.messageForm.get('userId')?.value || this.userAuthenticated || 0,
//     seen: false
//   };

//   // Função auxiliar para atualizar o conteúdo e forçar a detecção de mudanças
//   const updateContent = (data: Document_or_Message) => {
//     console.log('Atualizando conteúdo com:', data); // Log para depuração
//     this.userContent = {
//       ...this.userContent,
//       content: [...this.userContent.content, { data }]
//     };
//     this.changeDetectorRef.detectChanges();
//   };

//   // Função auxiliar para enviar a mensagem
//   const sendMessage = () => {
//     if (messageData.content) {
//       this.userService.UserMessage(messageData).subscribe(
//         (response) => {
//           if (response.data) {
//             // Criação do objeto Document_or_Message para mensagem
//             const messDoc: Document_or_Message = {
//               id: response.data.id,
//               content_or_FileName: response.data.content,
//               sentAt_or_UploadedAt: response.data.sentAt,
//               idConversation: response.data.idConversation,
//               status: response.data.status,
//               userId: response.data.userId,
//               doawloaded: response.data.seen,
//               type: 'message'
//             };
            
//             updateContent(messDoc);

//             this.clicked = true;
//             this.messageVerify = 'normal';

//             // Resetar o formulário e o arquivo selecionado
//             this.messageForm.reset();
//             this.selectedFile = null;
//           } else {
//             console.error('Resposta não contém dados esperados:', response);
//           }
//         },
//         (messageError) => {
//           console.error('Erro ao enviar mensagem:', messageError);
//         }
//       );
//     } else {
//       // Apenas limpar o estado se não houver mensagem
//       this.messageForm.reset();
//       this.selectedFile = null;
//     }
//   };

//   // Se houver um arquivo selecionado, envie o documento primeiro
//   if (this.selectedFile) {
//     const formData = new FormData();
//     formData.append('file', this.selectedFile);
//     formData.append('conversationId', this.userContent?.conversationId?.toString() || this.userContent1?.conversationId?.toString() || '');
//     formData.append('userId', this.userAuthenticated.toString() || '');

//     this.userService.uploadDocument(formData).subscribe(
//       (documentResponse) => {
//         this.fileName1 = '';

//         // Mostrar os dados do documento enviado
//         console.log('Documento enviado:', documentResponse);

//         // Atualize o conteúdo com a resposta do documento, se aplicável
//         if (documentResponse.data) {
//           const docData: Document_or_Message = {
//             id: documentResponse.data.id,
//             content_or_FileName: documentResponse.data.fileName, // Use fileName aqui
//             sentAt_or_UploadedAt: documentResponse.data.uploadedAt, // Use uploadedAt aqui
//             idConversation: this.messageForm.get('conversationId')?.value || this.userContent?.conversationId || this.userContent1?.conversationId,
//             status: documentResponse.data.status,
//             userId: this.userAuthenticated,
//             doawloaded: documentResponse.data.status, // Ajuste se necessário
//             type: 'document'
//           };
          
//           updateContent(docData);
//         }

//         // Enviar a mensagem se houver
//         sendMessage();
//       },
//       (documentError) => {
//         console.error('Erro ao enviar documento:', documentError);
//         alert('Erro ao enviar documento. Verifique o console para mais detalhes.');
//       }
//     );
//   } else {
//     // Se não houver arquivo, envie apenas a mensagem se houver
//     sendMessage();
//   }
// }


onSubmit(): void {
  // Se o formulário estiver inválido e nenhum arquivo estiver selecionado, exibir mensagem de erro
  if (this.messageForm.invalid && !this.selectedFile) {
    console.log('Formulário inválido. Verifique os campos.');
    return;
  }
      if(this.messageVerify === 'normal'){        
  // Criar objeto de mensagem
  const messageData: Message = {
    id: 0,
    content: this.messageForm.get('userMessage')?.value || '',
    sentAt: new Date().toISOString(),
    idConversation: this.messageForm.get('conversationId')?.value || this.userContent?.conversationId || this.userContent1?.conversationId,
    status: true,
    userId: this.messageForm.get('userId')?.value || this.userAuthenticated || 0,
    seen: false
  };
  // Função auxiliar para atualizar o conteúdo e forçar a detecção de mudanças
  const updateContent = (data: Document_or_Message) => {
   
    this.userContent = {
      ...this.userContent,
      content: [...this.userContent.content, { data }]
    };

    this.changeDetectorRef.detectChanges();
   
  };
  // Função auxiliar para enviar a mensagem
  const sendMessage = () => {
    if (messageData.content) {
      this.userService.UserMessage(messageData).subscribe(
        (response) => {
          if (response.data) {
            // Criação do objeto Document_or_Message para mensagem
            const messDoc: Document_or_Message = {
              id: response.data.id,
              content_or_FileName: response.data.content,
              sentAt_or_UploadedAt: response.data.sentAt,
              idConversation: response.data.idConversation,
              status: response.data.status,
              userId: response.data.userId,
              doawloaded: response.data.seen,
              type: 'message'
            };
            
            updateContent(messDoc);

            // Resetar o formulário e o arquivo selecionado
            this.messageForm.reset();
            this.selectedFile = null;
          } else {
            console.error('Resposta não contém dados esperados:', response);
          }
        },
        (messageError) => {
          console.error('Erro ao enviar mensagem:', messageError);
        }
      );
    } else {
      // Apenas limpar o estado se não houver mensagem
      this.messageForm.reset();
      this.selectedFile = null;
    }
  };
  // Se houver um arquivo selecionado, envie o documento primeiro
  if (this.selectedFile) {
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('conversationId', this.userContent?.conversationId?.toString());
    formData.append('userId', this.userAuthenticated.toString());

    this.userService.uploadDocument(formData).subscribe(
      (documentResponse) => {
       // console.log('Documento enviado:', documentResponse); // Log para depuração
         this.fileName1 = ''
        
        // Atualize o conteúdo com a resposta do documento, se aplicável
        if (documentResponse.data) {
          const docData: Document_or_Message = {
            id: documentResponse.data.id,
            content_or_FileName: documentResponse.data.fileName || 'Arquivo não disponível', // Verifique se fileName está correto
            sentAt_or_UploadedAt: documentResponse.data.uploadedAt || 'Data não disponível', // Verifique se uploadedAt está correto
            idConversation: this.messageForm.get('conversationId')?.value || this.userContent?.conversationId ,
            status: documentResponse.data.status,
            userId: this.userAuthenticated,
            doawloaded: documentResponse.data.doawloaded, // Ajuste se necessário
            type: 'document'
          };
          
          updateContent(docData);
        } else {
          console.error('Resposta do documento não contém dados esperados:', documentResponse);
        }
         
        // Enviar a mensagem se houver
        sendMessage();
      },
      (documentError) => {
        console.error('Erro ao enviar documento:', documentError);
        alert('Erro ao enviar documento. Verifique o console para mais detalhes.');
      }
      
    );
  } else {
    // Se não houver arquivo, envie apenas a mensagem se houver
    sendMessage();
  }
 }
      if(this.messageVerify === 'group'){
           
          // Criar objeto de mensagem
  const messageData: Message = {
    id: 0,
    content: this.messageForm.get('userMessage')?.value || '',
    sentAt: new Date().toISOString(),
    idConversation: this.messageForm.get('conversationId')?.value || this.userContent1?.conversationId,
    status: true,
    userId: this.messageForm.get('userId')?.value || this.userAuthenticated || 0,
    seen: false
  };
  // Função auxiliar para atualizar o conteúdo e forçar a detecção de mudanças
  const updateContent = (data: Document_or_Message) => {
   
    this.userContent1 = {
      ...this.userContent1,
      content: [...this.userContent1.content, { data }]
    };

    this.changeDetectorRef.detectChanges();
   
  };
  // Função auxiliar para enviar a mensagem
  const sendMessage = () => {
    if (messageData.content) {
      this.userService.UserMessage(messageData).subscribe(
        (response) => {
          if (response.data) {
            // Criação do objeto Document_or_Message para mensagem
            const messDoc: Document_or_Message = {
              id: response.data.id,
              content_or_FileName: response.data.content,
              sentAt_or_UploadedAt: response.data.sentAt,
              idConversation: response.data.idConversation,
              status: response.data.status,
              userId: response.data.userId,
              doawloaded: response.data.seen,
              type: 'message'
            };
            
            updateContent(messDoc);

            // Resetar o formulário e o arquivo selecionado
            this.messageForm.reset();
            this.selectedFile = null;
          } else {
            console.error('Resposta não contém dados esperados:', response);
          }
        },
        (messageError) => {
          console.error('Erro ao enviar mensagem:', messageError);
        }
      );
    } else {
      // Apenas limpar o estado se não houver mensagem
      this.messageForm.reset();
      this.selectedFile = null;
    }
  };
  // Se houver um arquivo selecionado, envie o documento primeiro
  if (this.selectedFile) {
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('conversationId', this.userContent1?.conversationId?.toString());
    formData.append('userId', this.userAuthenticated.toString());

    this.userService.uploadDocument(formData).subscribe(
      (documentResponse) => {
       // console.log('Documento enviado:', documentResponse); // Log para depuração
         this.fileName1 = ''
        
        // Atualize o conteúdo com a resposta do documento, se aplicável
        if (documentResponse.data) {
          const docData: Document_or_Message = {
            id: documentResponse.data.id,
            content_or_FileName: documentResponse.data.fileName || 'Arquivo não disponível', // Verifique se fileName está correto
            sentAt_or_UploadedAt: documentResponse.data.uploadedAt || 'Data não disponível', // Verifique se uploadedAt está correto
            idConversation: this.messageForm.get('conversationId')?.value || this.userContent1?.conversationId ,
            status: documentResponse.data.status,
            userId: this.userAuthenticated,
            doawloaded: documentResponse.data.doawloaded, // Ajuste se necessário
            type: 'document'
          };
          
          updateContent(docData);
        } else {
          console.error('Resposta do documento não contém dados esperados:', documentResponse);
        }
         
        // Enviar a mensagem se houver
        sendMessage();
      },
      (documentError) => {
        console.error('Erro ao enviar documento:', documentError);
        alert('Erro ao enviar documento. Verifique o console para mais detalhes.');
      }
      
    );
  } else {
    // Se não houver arquivo, envie apenas a mensagem se houver
    sendMessage();
  }
      }
}


onEnter(event: Event): void {
  const keyboardEvent = event as KeyboardEvent; // Assegura que o evento é um KeyboardEvent
  keyboardEvent.preventDefault();
  this.onSubmit();
}

  // Processo de salvar uma conversa
  SaveConversations(userConversation: ConversationModel): void {
    this.userService.CreateConversation(userConversation).subscribe(
      (response) => {
           if(response.data){
            
        //Pegando o id da novca conversa
          this.newChatId = response.data

          // Uma vez que em uma conversa  temos de ter no minimo duas pessoas envolvidas, segue abaixo os objectos:
          const participant1: Participant = {
               
            userId: this.userAuthenticated,
            participantId: 0,
            conversationId: response.data,
            status: true
           }
           
            const participant2: Participant = {
            
            userId: this.participantId,
            participantId: 0,
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
      this.downloadDocument(item);
    }
    
  }
  downloadDocument(item: Document_or_Message):  Document_or_Message {
    this.userService.downloadDocument(item.id).subscribe(
      (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = this.fileName; // Nome do arquivo que será baixado
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        item.doawloaded = true
      },
      error => {
        console.error('Error downloading document:', error);
        
      }
    );
    return  item
  }

    GetAllMyChats(): void{
      this.userService.GetConversations(this.userAuthenticated).subscribe(
        userData => {
  
            if(userData.data){
              this.allConversations = userData.data;
              this.conversationShow = this.allConversations.allConversation.filter(c => c.type === 'group')
              
              //Filtrando users que não seja o que autenticou
              this.chatWith = this.allConversations.allParticipants.filter(user => user.id !== this.userAuthenticated && user.status == true);  
            }
        },
        error => {
          console.error('Erro ao obter conversas:', error);
        }
      );
  
    } 

}
