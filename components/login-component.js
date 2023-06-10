import { loginUser } from "../api.js";

export function renderLoginForm ({ container, setToken, startPage}) {
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

loginUser({
    login: "admin",
    password: "admin"
}).then((user) => {
    console.log(user);
    setToken(`Bearer ${user.user.token}`);
    startPage();
})
})    
}