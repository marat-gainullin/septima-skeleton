import Security from 'septima-remote/security';
import Rpc from 'septima-remote/rpc';
import Logger from 'septima-utils/logger';
import Invoke from 'septima-utils/invoke';
import KeyCodes from 'kenga/key-codes';
import LoginTypeView from './users/views/login-type';
import LoginView from './users/views/login';
import RegistrationView from './users/views/registration';
import Workspace from './workspace';

const users = new Rpc.Rest('/users');

function login(email, password = "") {
    const loginView = new LoginView();
    loginView.txtEmail.onKeyPress =
        loginView.txtPassword.onKeyPress = (evt) => {
            Invoke.later(() => {
                loginView.btnSignIn.enabled = !!evt.source.text && !evt.source.error;
                if (evt.key === KeyCodes.KEY_ENTER && loginView.btnSignIn.enabled) {
                    loginView.btnSignIn.focus();
                    loginView.btnSignIn.onAction();
                }
            });
        };
    loginView.btnSignIn.onAction = () => {
        if (loginView.txtEmail.value) {
            Security.login(loginView.txtEmail.value, loginView.txtPassword.value)
                .then(Security.principal)
                .then(p => {
                    if (!p.name.startsWith('anonymous')) {
                        document.body.removeChild(loginView.surface.element);
                        loggedInAs(p);
                    } else {
                        alert('Неправильное имя пользователя или пароль');
                        loginView.txtPassword.focus();
                    }
                })
                .catch(alert);
        }
    };
    document.body.appendChild(loginView.surface.element);
    loginView.txtEmail.value = email;
    loginView.txtPassword.focus();
    if (password) {
        loginView.txtPassword.value = password;
        loginView.btnSignIn.onAction();
    }
}

function loggedInAs(principal) {
    users.get(principal.name)
        .then(user => {
            const workspace = new Workspace();
            document.body.appendChild(workspace.surface.element);
            workspace.lblSignedInAs.text = user.userName;
            workspace.btnSignOut.onAction = () => {
                principal.logout()
                    .then(() => {
                        window.location.reload(true)
                    })
                    .catch(Logger.severe);
            };
            Logger.info(`Hello ${user.userName}`);
        });
}

function notifyIfEmailVerified() {
    if (window.location.hash.startsWith("#e-mail-verification-failed")) {
        alert('Не удалось проверить адрес электронной почты. Пожалуйста, если Вы уже зарегистрированы, подтвердите адрес электронной почты еще раз в своем профиле.');
        window.location.hash = '';
    } else if (window.location.hash.startsWith("#e-mail-verified-")) {
        alert('Адрес электронной почты подтвержден. Теперь Вам будут доступны все возможности сервиса.');
        window.location.hash = '';
    }
}

function register(email) {
    const registrationView = new RegistrationView();
    document.body.appendChild(registrationView.surface.element);

    registrationView.txtUserName.emptyText = `Your nickname (${email} by default)`;
    registrationView.btnRegister.enabled = false;
    registrationView.txtUserName.focus();
    registrationView.txtUserName.onKeyPress =
        registrationView.txtNewPassword.onKeyPress =
            registrationView.txtNewPasswordConfirm.onKeyPress = (evt) => {
                Invoke.later(() => {
                    registrationView.btnRegister.enabled =
                        !!registrationView.txtNewPassword.text &&
                        !!registrationView.txtNewPasswordConfirm.text &&
                        registrationView.txtNewPassword.text === registrationView.txtNewPasswordConfirm.text;

                    registrationView.txtNewPassword.error = null;
                    registrationView.txtNewPasswordConfirm.error = null;
                    if (!registrationView.txtNewPassword.text) {
                        registrationView.txtNewPassword.error = 'Выберите себе пароль';
                    } else if (!registrationView.txtNewPasswordConfirm.text) {
                        registrationView.txtNewPasswordConfirm.error = 'Выбранный пароль еще раз';
                    } else if (registrationView.txtNewPassword.text !== registrationView.txtNewPasswordConfirm.text) {
                        registrationView.txtNewPasswordConfirm.error = 'Пароли не совпадают';
                    }
                    if (evt.key === KeyCodes.KEY_ENTER && registrationView.btnRegister.enabled) {
                        registrationView.btnRegister.focus();
                        registrationView.btnRegister.onAction();
                    }
                });
            };
    registrationView.btnRegister.onAction = () => {
        if (!!registrationView.txtNewPassword.value &&
            !!registrationView.txtNewPasswordConfirm.value &&
            registrationView.txtNewPassword.value === registrationView.txtNewPasswordConfirm.value) {
            users
                .post({
                    email: email,
                    userName: registrationView.txtUserName.value,
                    password: registrationView.txtNewPassword.value
                })
                .then(newUser => {
                    document.body.removeChild(registrationView.surface.element);
                    login(email, registrationView.txtNewPassword.value);
                })
                .catch(alert);
        }
    };
}

function chooseLoginType() {
    const loginTypeView = new LoginTypeView();
    document.body.appendChild(loginTypeView.surface.element);
    loginTypeView.txtEmail.focus();

    loginTypeView.btnContinue.enabled = false;
    loginTypeView.txtEmail.onKeyPress = (evt) => {
        Invoke.later(() => {
            loginTypeView.btnContinue.enabled = !!evt.source.text && !evt.source.error;
            if (evt.key === KeyCodes.KEY_ENTER && loginTypeView.btnContinue.enabled) {
                loginTypeView.btnContinue.focus();
                loginTypeView.btnContinue.onAction();
            }
        });
    };
    loginTypeView.btnContinue.onAction = () => {
        if (loginTypeView.txtEmail.value) {
            users.get(loginTypeView.txtEmail.value)
                .then(user => {
                    document.body.removeChild(loginTypeView.surface.element);
                    login(loginTypeView.txtEmail.value);
                })
                .catch(error => {
                    document.body.removeChild(loginTypeView.surface.element);
                    register(loginTypeView.txtEmail.value);
                });
        } else {
            loginTypeView.txtEmail.errorsText = 'Укажите, пожалуйста, адрес электронной почты';
        }
    };
}

Security.principal()
    .then(p => {
        notifyIfEmailVerified();
        if (p.name.startsWith('anonymous')) {
            if (window.location.hash.startsWith("#e-mail-verified-")) {
                const email = decodeURIComponent(window.location.hash.substring("#e-mail-verified-".length));
                login(email);
            } else {
                chooseLoginType();
            }
        } else {
            loggedInAs(p);
        }
    })
    .catch(Logger.severe);