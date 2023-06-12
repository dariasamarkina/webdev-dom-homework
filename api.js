// import { commentText } from "./script.js";
// import { commentName } from "./script.js";
// import { addForm } from "./script.js";
// import { addButton } from "./script.js";
// import { loadingMessage } from "./script.js";
import { formatDate } from "./format-date.js";
import { renderComments } from "./script.js";
// import { renderComments } from "./script.js";

export let appComments = [];



export function getData( { token }) {

    return fetch("https://wedev-api.sky.pro/api/v2/daria/comments", {
        method: "GET",
        headers: {
            Authorization: token,
        }
    })
        .then((response) => {
            return response.json();
        })
        .then((responseData) => {
            appComments = responseData.comments.map((comment) => {

                return {
                    name: comment.author.name,
                    date: new Date(comment.date).toLocaleString().slice(0, -3),
                    text: comment.text,
                    likes: comment.likes,
                    likeStatus: false,
                }
            })
            console.log(appComments);
            return appComments;
        })

}

export const addToServer = ({ newComment, token, loadingMessage, addButton, addForm, commentName, commentText}) => {

    const savedName = commentName.value;
    const savedText = commentText.value;

    fetch("https://wedev-api.sky.pro/api/v2/daria/comments", {
        method: "POST",
        body: JSON.stringify (newComment),
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

export function loginUser ( { login, password }) {
    return fetch("https://wedev-api.sky.pro/api/user/login", {
        method: "POST",
        body: JSON.stringify({
            login,
            password
        }),
    }).then((response) => {
        if (response.status === 400) {
            throw new Error ('Неверный логин или пароль');
        }
        return response.json();
    })
}

export function addUser ( { login, name, password }) {
    return fetch("https://wedev-api.sky.pro/api/user", {
        method: "POST",
        body: JSON.stringify({
            login,
            name,
            password
        }),
    }).then((response) => {
        if (response.status === 400) {
            throw new Error ('Такой пользователь уже существует');
        }
        return response.json();
    })
}