import Button from 'kenga-buttons/button';
import AnchorsPane from 'kenga-containers/anchors-pane';
import PasswordField from 'kenga-fields/password-field';
import Label from 'kenga-labels/label';

class KengaWidgets {
    constructor () {
        const anchorsPane = new AnchorsPane();
        this.anchorsPane = anchorsPane;
        const btnSignIn = new Button();
        this.btnSignIn = btnSignIn;
        const lblLogo = new Label();
        this.lblLogo = lblLogo;
        const txtPasswordConfirm = new PasswordField();
        this.txtPasswordConfirm = txtPasswordConfirm;
        const txtPassword = new PasswordField();
        this.txtPassword = txtPassword;
        anchorsPane.add(lblLogo);
        anchorsPane.add(txtPassword);
        anchorsPane.add(txtPasswordConfirm);
        anchorsPane.add(btnSignIn);
        {
            anchorsPane.element.style.width = '500px';
            anchorsPane.element.style.height = '500px';
        }
        {
            btnSignIn.text = 'Change it!';
            btnSignIn.element.style.left = '337px';
            btnSignIn.element.style.width = '128px';
            btnSignIn.element.style.top = '315px';
            btnSignIn.element.style.height = '40px';
        }
        {
            lblLogo.text = 'Logo';
            lblLogo.horizontalTextPosition = 'center';
            lblLogo.element.style.left = '120px';
            lblLogo.element.style.width = '248px';
            lblLogo.element.style.top = '20px';
            lblLogo.element.style.height = '135px';
        }
        {
            txtPasswordConfirm.emptyText = 'Confirm password';
            txtPasswordConfirm.element.style.left = '40px';
            txtPasswordConfirm.element.style.width = '426px';
            txtPasswordConfirm.element.style.top = '250px';
            txtPasswordConfirm.element.style.height = '40px';
        }
        {
            txtPassword.emptyText = 'Password';
            txtPassword.element.style.left = '40px';
            txtPassword.element.style.width = '426px';
            txtPassword.element.style.top = '180px';
            txtPassword.element.style.height = '40px';
        }
    }
}
export default KengaWidgets;