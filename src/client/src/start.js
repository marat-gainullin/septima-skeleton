import Security from 'septima-remote/security';
import Rpc from 'septima-remote/rpc';
import Resource from 'septima-remote/resource';
import Logger from 'septima-utils/logger';
import Invoke from 'septima-utils/invoke';
import KeyCodes from 'kenga/key-codes';
import Ui from 'kenga/utils';
import Window from 'kenga-window/window-pane';
import LoginTypeView from './users/views/login-type';
import LoginView from './users/views/login';
import RegistrationView from './users/views/registration';
import ProfileView from './users/views/profile';
import ChangePasswordView from './users/views/change-password';
import RecoverPasswordView from './users/views/recover-password';
import Workspace from './workspace';

const users = new Rpc.Rest('/users');

function openFile(mask) {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = false;
        input.accept = mask;
        input.style.width = input.style.height = '2em';
        input.style.top = input.style.left = '-1000px';
        document.body.appendChild(input);
        Ui.on(input, Ui.Events.CHANGE, () => {
            if (input.value) {
                const reader = new FileReader();
                reader.onload = () => {
                    document.body.removeChild(input);
                    resolve(input.files[0]);
                };
                reader.readAsText(input.files[0]);
            } else {
                document.body.removeChild(input);
                reject('Cancel');
            }
        });
        Invoke.delayed(60000, () => {
            if (input.parentElement) {
                document.body.removeChild(input);
            }
        });
        input.click();
    });
}

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
    loginView.lblPasswordLost.onMouseClick = (evt) => {
        const passwordRecover = new Rpc.Rest("/start-password-recover");
        passwordRecover.get(loginView.txtEmail.value)
            .then(() => {
                alert(`На почту '${loginView.txtEmail.value}' отправлено письмо с инструкциями о том как восстановить доступ.`);
            })
            .catch(Logger.severe);
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
                .catch(Logger.severe);
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
            workspace.lblSignedInAs.icon = user.avatar;
            workspace.lblSignedInAs.text = user.userName;
            workspace.lblSignedInAs.onMouseClick = (evt) => {
                const verifyEmail = new Rpc.Rest('/start-verify-e-mail');
                const profile = new ProfileView();
                profile.lblAvatar.icon = user.avatar;
                profile.lblAvatar.onMouseClick = (evt) => {
                    openFile('image/*')
                        .then(file => {
                            if (file.size < 1024 * 1024 * 4) {
                                return Resource.upload('/avatars', file, 'avatar');
                            } else {
                                alert('Выберите пожалуйста файл меньше 4 Мб');
                                throw 'Аватарка должна быть меньше 4 Мб';
                            }
                        })
                        .then(uploadedTo => {
                            user.avatar = uploadedTo;
                            profile.lblAvatar.icon = user.avatar;
                            return users.put(user.email, user);
                        })
                        .then(() => {
                            Logger.info(`User ${user.email} profile changed`);
                        })
                        .catch(Logger.severe)
                };
                profile.txtUserName.value = user.userName;
                profile.txtUserName.onValueChange = (evt) => {
                    user.userName = evt.source.value;
                    users.put(user.email, user)
                        .then(() => {
                            Logger.info(`User ${user.email} profile changed`);
                        })
                        .catch(Logger.severe);
                };
                profile.btnChangePassword.onAction = () => {
                    const passwordChanger = new ChangePasswordView();
                    passwordChanger.btnChangeIt.enabled = false;
                    passwordChanger.txtOldPassword.onKeyPress =
                        passwordChanger.txtNewPassword.onKeyPress =
                            passwordChanger.txtNewPasswordConfirm.onKeyPress = (evt) => {
                                Invoke.later(() => {
                                    passwordChanger.btnChangeIt.enabled =
                                        !!passwordChanger.txtNewPassword.text &&
                                        !!passwordChanger.txtNewPasswordConfirm.text &&
                                        passwordChanger.txtNewPassword.text === passwordChanger.txtNewPasswordConfirm.text;

                                    passwordChanger.txtNewPassword.error = null;
                                    passwordChanger.txtNewPasswordConfirm.error = null;
                                    if (!passwordChanger.txtNewPassword.text) {
                                        passwordChanger.txtNewPassword.error = 'Выберите новый пароль';
                                    } else if (!passwordChanger.txtNewPasswordConfirm.text) {
                                        passwordChanger.txtNewPasswordConfirm.error = 'Новый пароль еще раз';
                                    } else if (passwordChanger.txtNewPassword.text !== passwordChanger.txtNewPasswordConfirm.text) {
                                        passwordChanger.txtNewPasswordConfirm.error = 'Пароли не совпадают';
                                    }
                                    if (evt.key === KeyCodes.KEY_ENTER && passwordChanger.btnChangeIt.enabled) {
                                        passwordChanger.btnChangeIt.focus();
                                        passwordChanger.btnChangeIt.onAction();
                                    }
                                });
                            };
                    passwordChanger.btnChangeIt.onAction = (evt) => {
                        users.put(user.email, {
                            password: passwordChanger.txtOldPassword.value,
                            newPassword: passwordChanger.txtNewPassword.value
                        })
                            .then(() => {
                                alert('Ваш пароль изменен.');
                            })
                            .catch(Logger.severe);
                    };
                    const w = new Window(passwordChanger.surface);
                    w.showModal();
                    passwordChanger.txtOldPassword.focus();
                };
                profile.lblEmail.text = user.email;
                profile.btnVerifyEmail.enabled = !user.confirmed;
                if (user.confirmed) {
                    profile.btnVerifyEmail.text = 'Почта подтверждена';
                } else {
                    profile.btnVerifyEmail.onAction = (evt) => {
                        verifyEmail.get(user.email)
                            .then(() => {
                                alert('Проверьте пожалуйста свой почтовый ящик.');
                            })
                            .catch(Logger.severe);
                    };
                }
                profile.btnDestroyProfile.onAction = (evt) => {
                    if (confirm('Внимание! Это действие нельзя будет отменить. Вся Ваша личная информация будет потеряна. Продолжить?')) {
                        users.delete(user.email)
                            .then((evt) => {
                                window.location.reload(true);
                            })
                            .catch(Logger.severe);
                    }
                };
                const w = new Window(profile.surface);
                w.showModal();
            };
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

function notifyIfEmailOrPassword() {
    if (window.location.hash.startsWith("#e-mail-verification-failed")) {
        alert('Не удалось проверить адрес электронной почты. Пожалуйста, если Вы уже зарегистрированы, подтвердите адрес электронной почты еще раз в своем профиле.');
        window.location.hash = '';
    } else if (window.location.hash.startsWith("#e-mail-verified-")) {
        alert('Адрес электронной почты подтвержден. Теперь Вам будут доступны все возможности сервиса.');
        window.location.hash = '';
    }
}

function recoverPassword() {
    const passwordRecoverer = new RecoverPasswordView();
    passwordRecoverer.btnRecover.enabled = false;
    passwordRecoverer.txtNewPassword.onKeyPress =
        passwordRecoverer.txtNewPasswordConfirm.onKeyPress = (evt) => {
            Invoke.later(() => {
                passwordRecoverer.btnRecover.enabled =
                    !!passwordRecoverer.txtNewPassword.text &&
                    !!passwordRecoverer.txtNewPasswordConfirm.text &&
                    passwordRecoverer.txtNewPassword.text === passwordRecoverer.txtNewPasswordConfirm.text;

                passwordRecoverer.txtNewPassword.error = null;
                passwordRecoverer.txtNewPasswordConfirm.error = null;
                if (!passwordRecoverer.txtNewPassword.text) {
                    passwordRecoverer.txtNewPassword.error = 'Выберите себе пароль';
                } else if (!passwordRecoverer.txtNewPasswordConfirm.text) {
                    passwordRecoverer.txtNewPasswordConfirm.error = 'Выбранный пароль еще раз';
                } else if (passwordRecoverer.txtNewPassword.text !== passwordRecoverer.txtNewPasswordConfirm.text) {
                    passwordRecoverer.txtNewPasswordConfirm.error = 'Пароли не совпадают';
                }
                if (evt.key === KeyCodes.KEY_ENTER && passwordRecoverer.btnRecover.enabled) {
                    passwordRecoverer.btnRecover.focus();
                    passwordRecoverer.btnRecover.onAction();
                }
            });
        };
    passwordRecoverer.btnRecover.onAction = () => {
        if (!!passwordRecoverer.txtNewPassword.value &&
            !!passwordRecoverer.txtNewPasswordConfirm.value &&
            passwordRecoverer.txtNewPassword.value === passwordRecoverer.txtNewPasswordConfirm.value) {
            const location = window.location + '';
            const qIndex = location.indexOf('?');
            let baseUrl = location.substring(0, qIndex);
            if (baseUrl.endsWith('/'))
                baseUrl = baseUrl.substring(0, baseUrl.length - 1);
            Resource.loadText(
                baseUrl + '/complete-password-recover/' +
                location.substring(qIndex, location.length) +
                '&c=' + encodeURIComponent(passwordRecoverer.txtNewPassword.value))
                .then(v => {
                    alert('Ваш пароль изменен.');
                    window.location.href = baseUrl;
                })
                .catch(Logger.severe);
        }
    };
    document.body.appendChild(passwordRecoverer.surface.element);
    passwordRecoverer.txtNewPassword.focus();
}

function register(email) {
    const registrationView = new RegistrationView();
    document.body.appendChild(registrationView.surface.element);

    registrationView.btnRegister.enabled = false;
    registrationView.txtNewPassword.focus();
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
                    userName: null,
                    password: registrationView.txtNewPassword.value
                })
                .then(newUser => {
                    document.body.removeChild(registrationView.surface.element);
                    login(email, registrationView.txtNewPassword.value);
                })
                .catch(Logger.severe);
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


if (!document.body.id.startsWith('design://')) {
    Security.principal()
        .then(p => {
            notifyIfEmailOrPassword();
            const location = window.location + '';
            if (location.includes('a=') && location.includes('b=')) {
                recoverPassword();
            } else {
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
            }
        })
        .catch(Logger.severe);
}