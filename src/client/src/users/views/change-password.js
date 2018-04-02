import Button from 'kenga-buttons/button';
import AnchorsPane from 'kenga-containers/anchors-pane';
import FlowPane from 'kenga-containers/flow-pane';
import PasswordField from 'kenga-fields/password-field';
import Label from 'kenga-labels/label';

class KengaWidgets {
    constructor () {
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
        const pnlOldPassword = new FlowPane();
        this.pnlOldPassword = pnlOldPassword;
        const pnlNewPassword = new FlowPane();
        this.pnlNewPassword = pnlNewPassword;
        const pnlNewPasswordConfirm = new FlowPane();
        this.pnlNewPasswordConfirm = pnlNewPasswordConfirm;
        const pnlLogo = new FlowPane();
        this.pnlLogo = pnlLogo;
        const lblAvatar = new Label();
        this.lblAvatar = lblAvatar;
        surface.add(pnlLogo);
        surface.add(pnlOldPassword);
        surface.add(pnlNewPassword);
        surface.add(pnlNewPasswordConfirm);
        surface.add(btnChangeIt);
        surface.add(badCredentials);
        pnlLogo.add(lblAvatar);
        pnlOldPassword.add(txtOldPassword);
        pnlNewPassword.add(txtNewPassword);
        pnlNewPasswordConfirm.add(txtNewPasswordConfirm);
        {
            badCredentials.visible = false;
            badCredentials.text = 'Invalid old password';
            badCredentials.element.style.left = '40px';
            badCredentials.element.style.right = '40px';
            badCredentials.element.style.top = '440px';
            badCredentials.element.style.height = '20px';
        }
        {
            txtNewPasswordConfirm.emptyText = 'New password confirm';
            txtNewPasswordConfirm.element.style.width = '100%';
            txtNewPasswordConfirm.element.style.height = '100%';
        }
        {
            txtNewPassword.emptyText = 'New password';
            txtNewPassword.element.style.width = '100%';
            txtNewPassword.element.style.height = '100%';
        }
        {
            txtOldPassword.emptyText = 'Old password';
            txtOldPassword.element.style.width = '100%';
            txtOldPassword.element.style.height = '100%';
        }
        {
            btnChangeIt.text = 'Change it!';
            btnChangeIt.element.style.width = '128px';
            btnChangeIt.element.style.right = '40px';
            btnChangeIt.element.style.top = '380px';
            btnChangeIt.element.style.height = '40px';
        }
        {
            surface.element.style.width = '500px';
            surface.element.style.height = '500px';
        }
        {
            pnlOldPassword.hgap = null;
            pnlOldPassword.vgap = null;
            pnlOldPassword.element.style.left = '40px';
            pnlOldPassword.element.style.right = '40px';
            pnlOldPassword.element.style.top = '180px';
            pnlOldPassword.element.style.height = '40px';
        }
        {
            pnlNewPassword.hgap = null;
            pnlNewPassword.vgap = null;
            pnlNewPassword.element.style.left = '40px';
            pnlNewPassword.element.style.right = '40px';
            pnlNewPassword.element.style.top = '250px';
            pnlNewPassword.element.style.height = '40px';
        }
        {
            pnlNewPasswordConfirm.hgap = null;
            pnlNewPasswordConfirm.vgap = null;
            pnlNewPasswordConfirm.element.style.left = '40px';
            pnlNewPasswordConfirm.element.style.right = '40px';
            pnlNewPasswordConfirm.element.style.top = '320px';
            pnlNewPasswordConfirm.element.style.height = '40px';
        }
        {
            pnlLogo.hgap = null;
            pnlLogo.vgap = null;
            pnlLogo.element.style.left = '40px';
            pnlLogo.element.style.right = '40px';
            pnlLogo.element.style.top = '21px';
            pnlLogo.element.style.height = '150px';
        }
        {
            lblAvatar.toolTipText = 'Изменить аватар';
            lblAvatar.text = null;
            lblAvatar.iconTextGap = null;
            lblAvatar.horizontalTextPosition = 'center';
            lblAvatar.classes = 'a-avatar';
            lblAvatar.element.className += ' ' + lblAvatar.classes;
        }
    }
}
export default KengaWidgets;