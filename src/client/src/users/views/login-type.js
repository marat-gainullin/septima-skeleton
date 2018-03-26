import Button from 'kenga-buttons/button';
import AnchorsPane from 'kenga-containers/anchors-pane';
import EmailField from 'kenga-fields/email-field';
import Label from 'kenga-labels/label';
import ModelRadioButton from 'kenga-model-buttons/model-radio-button';

class KengaWidgets {
    constructor () {
        const surface = new AnchorsPane();
        this.surface = surface;
        const logo = new Label();
        this.logo = logo;
        const continueWithFacebook = new Button();
        this.continueWithFacebook = continueWithFacebook;
        const radioButton = new ModelRadioButton();
        this.radioButton = radioButton;
        const txtEmail = new EmailField();
        this.txtEmail = txtEmail;
        const btnContinue = new Button();
        this.btnContinue = btnContinue;
        surface.add(logo);
        surface.add(continueWithFacebook);
        surface.add(txtEmail);
        surface.add(btnContinue);
        {
            surface.element.style.width = '500px';
            surface.element.style.height = '500px';
        }
        {
            logo.text = 'Logo';
            logo.horizontalTextPosition = 'center';
            logo.element.style.left = '120px';
            logo.element.style.width = '248px';
            logo.element.style.top = '20px';
            logo.element.style.height = '135px';
        }
        {
            continueWithFacebook.text = 'Facebook';
            continueWithFacebook.element.style.left = '40px';
            continueWithFacebook.element.style.width = '432px';
            continueWithFacebook.element.style.top = '180px';
            continueWithFacebook.element.style.height = '41px';
        }
        {
            radioButton.text = 'radioButton';
        }
        {
            txtEmail.emptyText = 'E - mail';
            txtEmail.element.style.left = '40px';
            txtEmail.element.style.width = '431px';
            txtEmail.element.style.top = '250px';
            txtEmail.element.style.height = '40px';
        }
        {
            btnContinue.text = 'Продолжить';
            btnContinue.element.style.left = '341px';
            btnContinue.element.style.width = '128px';
            btnContinue.element.style.top = '315px';
            btnContinue.element.style.height = '40px';
        }
    }
}
export default KengaWidgets;