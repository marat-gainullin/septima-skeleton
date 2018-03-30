import Button from 'kenga-buttons/button';
import AnchorsPane from 'kenga-containers/anchors-pane';
import PasswordField from 'kenga-fields/password-field';
import Label from 'kenga-labels/label';

class KengaWidgets {
    constructor () {
        const lblLogo = new Label();
        this.lblLogo = lblLogo;
        const txtNewPassword = new PasswordField();
        this.txtNewPassword = txtNewPassword;
        const txtNewPasswordConfirm = new PasswordField();
        this.txtNewPasswordConfirm = txtNewPasswordConfirm;
        const btnRecover = new Button();
        this.btnRecover = btnRecover;
        const surface = new AnchorsPane();
        this.surface = surface;
        surface.add(lblLogo);
        surface.add(txtNewPassword);
        surface.add(txtNewPasswordConfirm);
        surface.add(btnRecover);
        {
            lblLogo.text = 'Logo';
            lblLogo.horizontalTextPosition = 'center';
            lblLogo.element.style.left = '120px';
            lblLogo.element.style.width = '248px';
            lblLogo.element.style.top = '20px';
            lblLogo.element.style.height = '135px';
        }
        {
            txtNewPassword.emptyText = 'Password';
            txtNewPassword.element.style.left = '40px';
            txtNewPassword.element.style.width = '426px';
            txtNewPassword.element.style.top = '180px';
            txtNewPassword.element.style.height = '40px';
        }
        {
            txtNewPasswordConfirm.emptyText = 'Confirm password';
            txtNewPasswordConfirm.element.style.left = '40px';
            txtNewPasswordConfirm.element.style.width = '426px';
            txtNewPasswordConfirm.element.style.top = '250px';
            txtNewPasswordConfirm.element.style.height = '40px';
        }
        {
            btnRecover.text = 'Change it!';
            btnRecover.element.style.left = '337px';
            btnRecover.element.style.width = '128px';
            btnRecover.element.style.top = '315px';
            btnRecover.element.style.height = '40px';
        }
        {
            surface.element.style.width = '500px';
            surface.element.style.height = '400px';
        }
    }
}
export default KengaWidgets;