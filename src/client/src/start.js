import Security from 'septima-remote/security';
import Rpc from 'septima-remote/rpc';
import Logger from 'septima-utils/logger';
import LoginTypeView from './users/views/login-type';
import LoginView from './users/views/login';
import Workspace from './workspace';

Security.principal()
    .then(p => {
        if (p.name.startsWith('anonymous')) {
            const loginType = new LoginTypeView();
            document.body.appendChild(loginType.surface.element);
            loginType.btnContinue.onAction = () => {
                Rpc.proxy('');
            };
        } else {
            Logger.info(`Hello ${p.name}`);
        }
    })
    .catch(Logger.severe);