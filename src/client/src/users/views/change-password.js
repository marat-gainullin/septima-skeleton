import Button from 'kenga-buttons/button';
import AnchorsPane from 'kenga-containers/anchors-pane';
import PasswordField from 'kenga-fields/password-field';
import Label from 'kenga-labels/label';

class KengaWidgets {
    constructor () {
        const lblLogo = new Label();
        this.lblLogo = lblLogo;
        const badCredentials = new Label();
        this.badCredentials = badCredentials;
        const txtNewPasswordConfirm = new PasswordField();
        this.txtNewPasswordConfirm = txtNewPasswordConfirm;
        const txtNewPassword = new PasswordField();
        this.txtNewPassword = txtNewPassword;
        const txtOldPassword = new PasswordField();
        this.txtOldPassword = txtOldPassword;
        const btnChangeIt = new Button();
        this.btnChangeIt = btnChangeIt;
        const surface = new AnchorsPane();
        this.surface = surface;
        surface.add(lblLogo);
        surface.add(txtOldPassword);
        surface.add(txtNewPassword);
        surface.add(txtNewPasswordConfirm);
        surface.add(btnChangeIt);
        surface.add(badCredentials);
        {
            lblLogo.text = 'Logo';
            lblLogo.horizontalTextPosition = 'center';
            lblLogo.element.style.left = '120px';
            lblLogo.element.style.width = '248px';
            lblLogo.element.style.top = '20px';
            lblLogo.element.style.height = '135px';
        }
        {
            badCredentials.visible = false;
            badCredentials.text = 'Invalid old password';
            badCredentials.element.style.left = '40px';
            badCredentials.element.style.width = '421px';
            badCredentials.element.style.top = '440px';
            badCredentials.element.style.height = '18px';
        }
        {
            txtNewPasswordConfirm.emptyText = 'New password confirm';
            txtNewPasswordConfirm.element.style.left = '40px';
            txtNewPasswordConfirm.element.style.width = '426px';
            txtNewPasswordConfirm.element.style.top = '320px';
            txtNewPasswordConfirm.element.style.height = '40px';
        }
        {
            txtNewPassword.emptyText = 'New password';
            txtNewPassword.element.style.left = '40px';
            txtNewPassword.element.style.width = '426px';
            txtNewPassword.element.style.top = '250px';
            txtNewPassword.element.style.height = '40px';
        }
        {
            txtOldPassword.emptyText = 'Old password';
            txtOldPassword.element.style.left = '40px';
            txtOldPassword.element.style.width = '426px';
            txtOldPassword.element.style.top = '180px';
            txtOldPassword.element.style.height = '40px';
        }
        {
            btnChangeIt.text = 'Change it!';
            btnChangeIt.element.style.left = '340px';
            btnChangeIt.element.style.width = '128px';
            btnChangeIt.element.style.top = '380px';
            btnChangeIt.element.style.height = '40px';
        }
        {
            surface.element.style.width = '500px';
            surface.element.style.height = '500px';
        }
    }
}
export default KengaWidgets;