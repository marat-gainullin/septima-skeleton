import Button from 'kenga-buttons/button';
import AnchorsPane from 'kenga-containers/anchors-pane';
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
        surface.add(lblAvatar);
        surface.add(txtUserName);
        surface.add(btnChangePassword);
        surface.add(btnVerifyEmail);
        surface.add(pnlDangerZone);
        surface.add(lblEmail);
        pnlDangerZone.add(lblDangerZone);
        pnlDangerZone.add(btnDestroyProfile);
        {
            surface.element.style.width = '500px';
            surface.element.style.height = '550px';
        }
        {
            lblAvatar.toolTipText = 'Изменить аватар';
            lblAvatar.text = null;
            lblAvatar.horizontalTextPosition = 'center';
            lblAvatar.element.style.left = '40px';
            lblAvatar.element.style.width = '150px';
            lblAvatar.element.style.top = '15px';
            lblAvatar.element.style.height = '150px';
        }
        {
            pnlDangerZone.background = '#f2bfc5';
            pnlDangerZone.element.style.left = '40px';
            pnlDangerZone.element.style.width = '425px';
            pnlDangerZone.element.style.top = '430px';
            pnlDangerZone.element.style.height = '100px';
        }
        {
            lblDangerZone.foreground = '#ffffff';
            lblDangerZone.text = 'Опасная зона';
            lblDangerZone.element.style.left = '9px';
            lblDangerZone.element.style.top = '10px';
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
            txtUserName.element.style.left = '40px';
            txtUserName.element.style.width = '425px';
            txtUserName.element.style.top = '195px';
            txtUserName.element.style.height = '40px';
        }
        {
            lblEmail.text = 'None';
            lblEmail.element.style.left = '200px';
            lblEmail.element.style.top = '340px';
            lblEmail.element.style.height = '19px';
        }
        {
            btnDestroyProfile.background = '#9b1e2b';
            btnDestroyProfile.foreground = '#ffffff';
            btnDestroyProfile.text = 'Удалиться...';
            btnDestroyProfile.element.style.left = '9px';
            btnDestroyProfile.element.style.width = '140px';
            btnDestroyProfile.element.style.top = '51px';
            btnDestroyProfile.element.style.height = '40px';
        }
    }
}
export default KengaWidgets;