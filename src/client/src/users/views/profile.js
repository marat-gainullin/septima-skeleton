import Button from 'kenga-buttons/button';
import AnchorsPane from 'kenga-containers/anchors-pane';
import FlowPane from 'kenga-containers/flow-pane';
import TextField from 'kenga-fields/text-field';
import Label from 'kenga-labels/label';

class KengaWidgets {
    constructor () {
        const surface = new AnchorsPane();
        this.surface = surface;
        const lblAvatar = new Label();
        this.lblAvatar = lblAvatar;
        const pnlDangerZone = new AnchorsPane();
        this.pnlDangerZone = pnlDangerZone;
        const lblDangerZone = new Label();
        this.lblDangerZone = lblDangerZone;
        const btnChangePassword = new Button();
        this.btnChangePassword = btnChangePassword;
        const btnVerifyEmail = new Button();
        this.btnVerifyEmail = btnVerifyEmail;
        const txtUserName = new TextField();
        this.txtUserName = txtUserName;
        const lblEmail = new Label();
        this.lblEmail = lblEmail;
        const btnDestroyProfile = new Button();
        this.btnDestroyProfile = btnDestroyProfile;
        const pnlUserName = new FlowPane();
        this.pnlUserName = pnlUserName;
        const pnlAvatar = new FlowPane();
        this.pnlAvatar = pnlAvatar;
        surface.add(pnlAvatar);
        surface.add(pnlUserName);
        surface.add(btnChangePassword);
        surface.add(btnVerifyEmail);
        surface.add(lblDangerZone);
        surface.add(pnlDangerZone);
        surface.add(lblEmail);
        pnlAvatar.add(lblAvatar);
        pnlUserName.add(txtUserName);
        pnlDangerZone.add(btnDestroyProfile);
        {
            surface.element.style.width = '500px';
            surface.element.style.height = '550px';
        }
        {
            lblAvatar.toolTipText = 'Изменить аватар';
            lblAvatar.text = null;
            lblAvatar.iconTextGap = null;
            lblAvatar.horizontalTextPosition = 'center';
            lblAvatar.classes = 'a-avatar';
            lblAvatar.element.className += ' ' + lblAvatar.classes;
        }
        {
            pnlDangerZone.classes = 'a-danger-panel';
            pnlDangerZone.element.className += ' ' + pnlDangerZone.classes;
            pnlDangerZone.element.style.left = '40px';
            pnlDangerZone.element.style.right = '40px';
            pnlDangerZone.element.style.top = '430px';
            pnlDangerZone.element.style.height = '100px';
        }
        {
            lblDangerZone.text = 'Опасная зона';
            lblDangerZone.element.style.left = '40px';
            lblDangerZone.element.style.top = '404px';
        }
        {
            btnChangePassword.text = 'Изменить пароль...';
            btnChangePassword.element.style.left = '40px';
            btnChangePassword.element.style.width = '140px';
            btnChangePassword.element.style.top = '264px';
            btnChangePassword.element.style.height = '40px';
        }
        {
            btnVerifyEmail.toolTipText = 'На ваш электронный адрес будет выслано письмо с инструкциями';
            btnVerifyEmail.text = 'Подтвердить почту';
            btnVerifyEmail.element.style.left = '40px';
            btnVerifyEmail.element.style.width = '140px';
            btnVerifyEmail.element.style.top = '330px';
            btnVerifyEmail.element.style.height = '40px';
        }
        {
            txtUserName.emptyText = 'Имя пользователя';
            txtUserName.element.style.width = '100%';
            txtUserName.element.style.height = '100%';
        }
        {
            lblEmail.text = 'None';
            lblEmail.element.style.left = '200px';
            lblEmail.element.style.top = '340px';
            lblEmail.element.style.height = '19px';
        }
        {
            btnDestroyProfile.text = 'Удалиться...';
            btnDestroyProfile.classes = 'a-danger-button';
            btnDestroyProfile.element.className += ' ' + btnDestroyProfile.classes;
            btnDestroyProfile.element.style.left = '9px';
            btnDestroyProfile.element.style.width = '140px';
            btnDestroyProfile.element.style.top = '51px';
            btnDestroyProfile.element.style.height = '40px';
        }
        {
            pnlUserName.hgap = null;
            pnlUserName.vgap = null;
            pnlUserName.element.style.left = '40px';
            pnlUserName.element.style.right = '42px';
            pnlUserName.element.style.top = '192px';
            pnlUserName.element.style.height = '40px';
        }
        {
            pnlAvatar.hgap = null;
            pnlAvatar.vgap = null;
            pnlAvatar.element.style.left = '40px';
            pnlAvatar.element.style.right = '40px';
            pnlAvatar.element.style.top = '15px';
            pnlAvatar.element.style.height = '150px';
        }
    }
}
export default KengaWidgets;