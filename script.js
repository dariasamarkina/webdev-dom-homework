// import { renderComments } from "./render.js";
import { getData } from "./api.js";
// import { addToList } from "./api.js";
// import { appComments } from "./api.js";
// import { initLikesButton } from "./like-button.js";
// import { addReply } from "./add-reply.js";

import { formatDate } from "./format-date.js";

const container = document.querySelector('.container');
let appComments = [];
let token = "Bearer asb4c4boc86gasb4c4boc86g37w3cc3bo3b83k4g37k3bk3cg3c03ck4k";
token = null;

export const renderComments = (comm) => {

    if (!token) {
        const appHtml = `
                <div class="login-form">
                    <input
                        type="text"
                        class="login-form-login"
                        placeholder="Логин"
                    />
                    <input
                        type="password"
                        class="login-form-password"
                        placeholder="Пароль"
                    />
                    <div class="login-form-row">
                        <button class="login-form-enter">Войти</button>
                        <button class="login-form-toreg">Перейти к регистрации</button>
                    </div>
                </div>`

    container.innerHTML = appHtml;

    const enterButton = document.querySelector('.login-form-enter');
    enterButton.addEventListener('click', () => {
        token = "Bearer asb4c4boc86gasb4c4boc86g37w3cc3bo3b83k4g37k3bk3cg3c03ck4k";
        startPage()
        
    })    

    return;
    }

    const commentsHtml = comm.map((comment, index) => {
        return `
        <li class="comment" data-index="${index}">
        <div class="comment-header">
            <div>${comment.name.replaceAll("&", "&amp;")
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll('"', "&quot;")} </div>
            <div>${comment.date} </div>
        </div>
        <div class="comment-body"> 
            <div class="comment-text">
            ${comment.text.replaceAll("&", "&amp;")
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll('"', "&quot;")
                .replaceAll('QUOTE_BEGIN', "<div class='quote'>")
                .replaceAll('QUOTE_END', "</div>")
            }
        <button class="edit-button" data-index="${index}">Редактировать</button>
            </div>
        </div>
        <div class="comment-footer"> 
            <div class="likes">
                <span class="likes-counter">${comment.likes}</span>
                <button class="like-button ${comment.likeStatus}" data-index="${index}"</button>
            </div>
        </div> 
    </li>`
    }).join("");

    const appHtml = `
                <ul class="comments">
                ${commentsHtml}
                </ul>
                <div class="add-form">
                    <input
                        type="text"
                        class="add-form-name"
                        placeholder="Введите ваше имя"
                    />
                    <textarea
                        type="textarea"
                        class="add-form-text"
                        placeholder="Введите ваш коментарий"
                        rows="4"
                    ></textarea>
                    <div class="add-form-row">
                        <button class="remove-form-button">Удалить последний комментарий</button>
                        <button class="add-form-button">Написать</button>
                    </div>
                </div>`

    container.innerHTML = appHtml;

    const addButton = document.querySelector('.add-form-button');
const commentName = document.querySelector('.add-form-name');
const commentText = document.querySelector('.add-form-text');
const commentsList = document.querySelector('.comments');
const addForm = document.querySelector('.add-form');

const loadingMessage = document.createElement('h3');
loadingMessage.classList.add('hidden');
loadingMessage.textContent = 'Список комментариев загружается...';
container.prepend(loadingMessage);

const postMessage = document.createElement('h3');
postMessage.classList.add('hidden');
postMessage.textContent = 'Комментарий публикуется...';
container.appendChild(postMessage);

addButton.setAttribute('disabled', '');

commentName.addEventListener('input', () => {
    if (commentText.value) {
        addButton.removeAttribute('disabled');
    } else
        return;
})

commentText.addEventListener('input', () => {
    if (commentName.value) {
        addButton.removeAttribute('disabled');
    } else
        return;
})

addButton.addEventListener('click', (e) => {

    addForm.classList.add('hidden');
    postMessage.classList.remove('hidden');

    addToList();
        addForm.classList.remove('hidden');
        addButton.removeAttribute('disabled')
        postMessage.classList.add('hidden');
})

addForm.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
        addToList();
        addForm.classList.remove('hidden');
        addButton.removeAttribute('disabled')
        postMessage.classList.add('hidden');
    }
})

const removeButton = document.querySelector('.remove-form-button');

removeButton.addEventListener('click', () => {
    appComments.pop();
    renderComments(appComments);
});

const addToServer = (comment) => {

    const savedName = commentName.value;
    const savedText = commentText.value;

    fetch("https://wedev-api.sky.pro/api/v2/daria/comments", {
        method: "POST",
        body: JSON.stringify({
            name: commentName.value
                .replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
            text: commentText.value
                .replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
            forceError: true,
        }),
        headers: {
            Authorization: token,
        }
    })
        .then((response) => {
            if (!response.ok) {
                if (response.status === 500) {
                    throw new Error('Сервер упал');
                }
                if (response.status === 400) {
                    throw new Error('Ошибка ввода');
                }  
            }

            return response.json();
        })
        .then((responseData) => {
            console.log(responseData);
            return getData({ token }).then((comments => renderComments(comments)));
        })
        .catch((error) => {
            console.log('Ошибка при отправке комментария на сервер:', error);

            if (error.message === 'Ошибка ввода') {
                alert('Имя и сообщение должны быть не короче 3 символов');
            } else if (error.message === 'Сервер упал') {
                alert('Сервер сломался, попробуйте позже');
            } else {
                alert('Кажется, у вас сломался интернет, попробуйте позже');
            }

            commentName.value = savedName;
            commentText.value = savedText;
            addForm.classList.remove('hidden');
            addButton.removeAttribute('disabled')
            loadingMessage.classList.add('hidden');
        });

}

const addToList = () => {

    commentName.classList.remove('error');
    if (commentName.value === '') {
        commentName.classList.add('error');
        return;
    }

    commentText.classList.remove('error');
    if (commentText.value === '') {
        commentText.classList.add('error');
        return;
    }

    const newComment = {
        name: commentName.value
            .replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
        text: commentText.value
            .replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
        date: formatDate(),
        like: 0,
        likeStatus: false,
    }

    addToServer(newComment);

    commentName.value = '';
    commentText.value = '';
    addButton.setAttribute('disabled', '');
}

    // initLikesButton();
    // addReply();
}


// export const addButton = document.querySelector('.add-form-button');
// export const commentName = document.querySelector('.add-form-name');
// export const commentText = document.querySelector('.add-form-text');
// export const commentsList = document.querySelector('.comments');
// export const addForm = document.querySelector('.add-form');

// export const loadingMessage = document.createElement('h3');
// loadingMessage.classList.add('hidden');
// loadingMessage.textContent = 'Список комментариев загружается...';
// container.prepend(loadingMessage);

// const postMessage = document.createElement('h3');
// postMessage.classList.add('hidden');
// postMessage.textContent = 'Комментарий публикуется...';
// container.appendChild(postMessage);

// renderComments(appComments);
startPage();



function startPage() {
    // commentsList.classList.add('hidden');
    // loadingMessage.classList.add('message');
    // loadingMessage.classList.remove('hidden');

    getData({ token }).then((comments => renderComments(comments)));
    
    // loadingMessage.classList.add('hidden');
    // addForm.classList.remove('hidden');
    // postMessage.classList.add('hidden');

    // commentsList.classList.remove('hidden');

}

// renderComments(appComments);

// addButton.setAttribute('disabled', '');

// commentName.addEventListener('input', () => {
//     if (commentText.value) {
//         addButton.removeAttribute('disabled');
//     } else
//         return;
// })

// commentText.addEventListener('input', () => {
//     if (commentName.value) {
//         addButton.removeAttribute('disabled');
//     } else
//         return;
// })

// addButton.addEventListener('click', (e) => {

//     addForm.classList.add('hidden');
//     postMessage.classList.remove('hidden');

//     addToList();
//         addForm.classList.remove('hidden');
//         addButton.removeAttribute('disabled')
//         postMessage.classList.add('hidden');
// })

// addForm.addEventListener('keyup', (event) => {
//     if (event.keyCode === 13) {
//         addToList();
//         addForm.classList.remove('hidden');
//         addButton.removeAttribute('disabled')
//         postMessage.classList.add('hidden');
//     }
// })

// const removeButton = document.querySelector('.remove-form-button');

// removeButton.addEventListener('click', () => {
//     appComments.pop();
//     renderComments(appComments);
// });








// function getData() {

//     return fetch("https://wedev-api.sky.pro/api/v2/daria/comments", {
//         method: "GET",
//         headers: {
//             Authorization: token,
//         }
//     })
//         .then((response) => {
//             return response.json();
//         })
//         .then((responseData) => {
//             appComments = responseData.comments.map((comment) => {

//                 return {
//                     name: comment.author.name,
//                     date: new Date(comment.date).toLocaleString().slice(0, -3),
//                     text: comment.text,
//                     likes: comment.likes,
//                     likeStatus: false,
//                 }
//             })
//             console.log(appComments);
//             return appComments;
//         })
// }

// const addToServer = (comment) => {

//     const savedName = commentName.value;
//     const savedText = commentText.value;

//     fetch("https://wedev-api.sky.pro/api/v2/daria/comments", {
//         method: "POST",
//         body: JSON.stringify({
//             name: commentName.value
//                 .replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
//             text: commentText.value
//                 .replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
//             forceError: true,
//         }),
//         headers: {
//             Authorization: token,
//         }
//     })
//         .then((response) => {
//             if (!response.ok) {
//                 if (response.status === 500) {
//                     throw new Error('Сервер упал');
//                 }
//                 if (response.status === 400) {
//                     throw new Error('Ошибка ввода');
//                 }  
//             }

//             return response.json();
//         })
//         .then((responseData) => {
//             console.log(responseData);
//             return getData().then((comments => renderComments(comments)));
//         })
//         .catch((error) => {
//             console.log('Ошибка при отправке комментария на сервер:', error);

//             if (error.message === 'Ошибка ввода') {
//                 alert('Имя и сообщение должны быть не короче 3 символов');
//             } else if (error.message === 'Сервер упал') {
//                 alert('Сервер сломался, попробуйте позже');
//             } else {
//                 alert('Кажется, у вас сломался интернет, попробуйте позже');
//             }

//             commentName.value = savedName;
//             commentText.value = savedText;
//             addForm.classList.remove('hidden');
//             addButton.removeAttribute('disabled')
//             loadingMessage.classList.add('hidden');
//         });

// }

// const addToList = () => {

//     commentName.classList.remove('error');
//     if (commentName.value === '') {
//         commentName.classList.add('error');
//         return;
//     }

//     commentText.classList.remove('error');
//     if (commentText.value === '') {
//         commentText.classList.add('error');
//         return;
//     }

//     const newComment = {
//         name: commentName.value
//             .replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
//         text: commentText.value
//             .replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
//         date: formatDate(),
//         like: 0,
//         likeStatus: false,
//     }

//     addToServer(newComment);

//     commentName.value = '';
//     commentText.value = '';
//     addButton.setAttribute('disabled', '');
// }