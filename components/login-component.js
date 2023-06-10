import { loginUser } from "../api.js";

export function renderLoginForm ({ container, setToken, startPage}) {
    let isLoginMode = true;

    const renderForm = () => {
        const appHtml = `
        <div class="login-form">
            <h3 class="form-title">Форма ${isLoginMode ? "входа" : "регистирации"}</h3>
            ${isLoginMode ? `` : `<input
                                    type="text"
                                    class="login-form-name"
                                    placeholder="Имя"
                                />`}   
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
                <button class="login-form-enter">${isLoginMode ? "Войти" : "Зарегистрироваться"}</button>
                <button class="login-form-toreg">${isLoginMode ? "Перейти к регистрации" : "Перейти к форме входа"}</button>
            </div>
        </div>`
    
    container.innerHTML = appHtml;
    
    const registrationButton = document.querySelector('.login-form-toreg');
    registrationButton.addEventListener('click', () => {
        isLoginMode = !isLoginMode;
        renderForm();
    })
    
    const enterButton = document.querySelector('.login-form-enter');
    enterButton.addEventListener('click', () => {
    
        const loginValue = document.querySelector('.login-form-login').value;
        const passwordValue = document.querySelector('.login-form-password').value;
    
        if (!loginValue) {
            alert ('Введите логин');
            return;
        }
        if (!passwordValue) {
            alert ('Введите пароль');
            return;
        }
    
    loginUser({
        login: loginValue,
        password: passwordValue
        }).then((user) => {
            setToken(`Bearer ${user.user.token}`);
            startPage();
            }).catch(error => {
                alert(error.message);
            })
        }) 
    }

    renderForm();
}