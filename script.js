// import { renderComments } from "./render.js";
import { getData } from "./api.js";
import { addToServer } from "./api.js";
import { renderLoginForm } from "./components/login-component.js";
// import { appComments } from "./api.js";
import { initLikesButton } from "./like-button.js";
// import { addReply } from "./add-reply.js";

import { formatDate } from "./format-date.js";

const container = document.querySelector('.container');
let appComments = [];
let token = "Bearer asb4c4boc86gasb4c4boc86g37w3cc3bo3b83k4g37k3bk3cg3c03ck4k";
token = null;

export const renderComments = (comm) => {

    if (!token) {
        renderLoginForm( {container, setToken: (newToken) => {
            token = newToken;
        }, startPage})

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

        addToServer({ newComment, token, loadingMessage, addButton, addForm, commentName, commentText});

        commentName.value = '';
        commentText.value = '';
        addButton.setAttribute('disabled', '');
    }

    initLikesButton();
    // addReply();
}

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