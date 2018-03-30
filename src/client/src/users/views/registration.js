import Button from 'kenga-buttons/button';
import AnchorsPane from 'kenga-containers/anchors-pane';
import FlowPane from 'kenga-containers/flow-pane';
import PasswordField from 'kenga-fields/password-field';
import Label from 'kenga-labels/label';

class KengaWidgets {
    constructor () {
        const lblLogo = new Label();
        this.lblLogo = lblLogo;
        const txtNewPasswordConfirm = new PasswordField();
        this.txtNewPasswordConfirm = txtNewPasswordConfirm;
        const txtNewPassword = new PasswordField();
        this.txtNewPassword = txtNewPassword;
        const btnRegister = new Button();
        this.btnRegister = btnRegister;
        const pnlPasswordQuality = new FlowPane();
        this.pnlPasswordQuality = pnlPasswordQuality;
        const surface = new AnchorsPane();
        this.surface = surface;
        surface.add(lblLogo);
        surface.add(txtNewPassword);
        surface.add(txtNewPasswordConfirm);
        surface.add(btnRegister);
        surface.add(pnlPasswordQuality);
        {
            lblLogo.text = 'Logo';
            lblLogo.horizontalTextPosition = 'center';
            lblLogo.element.style.left = '120px';
            lblLogo.element.style.width = '248px';
            lblLogo.element.style.top = '20px';
            lblLogo.element.style.height = '135px';
        }
        {
            txtNewPasswordConfirm.emptyText = 'New password confirm';
            txtNewPasswordConfirm.element.style.left = '40px';
            txtNewPasswordConfirm.element.style.width = '426px';
            txtNewPasswordConfirm.element.style.top = '270px';
            txtNewPasswordConfirm.element.style.height = '40px';
        }
        {
            txtNewPassword.emptyText = 'New password';
            txtNewPassword.element.style.left = '40px';
            txtNewPassword.element.style.width = '426px';
            txtNewPassword.element.style.top = '200px';
            txtNewPassword.element.style.height = '40px';
        }
        {
            btnRegister.text = 'Register me!';
            btnRegister.element.style.left = '340px';
            btnRegister.element.style.width = '128px';
            btnRegister.element.style.top = '390px';
            btnRegister.element.style.height = '40px';
        }
        {
            pnlPasswordQuality.hgap = 10;
            pnlPasswordQuality.vgap = 10;
            pnlPasswordQuality.element.style.left = '50px';
            pnlPasswordQuality.element.style.width = '410px';
            pnlPasswordQuality.element.style.top = '330px';
            pnlPasswordQuality.element.style.height = '3px';
        }
        {
            surface.element.style.width = '500px';
            surface.element.style.height = '450px';
        }
    }
}
export default KengaWidgets;