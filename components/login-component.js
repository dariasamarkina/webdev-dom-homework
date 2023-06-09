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

setToken("Bearer asb4c4boc86gasb4c4boc86g37w3cc3bo3b83k4g37k3bk3cg3c03ck4k");
startPage();

})    
}