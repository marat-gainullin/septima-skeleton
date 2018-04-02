import Button from 'kenga-buttons/button';
import AnchorsPane from 'kenga-containers/anchors-pane';
import ColumnNode from 'kenga-grid/columns/column-node';
import MarkerServiceNode from 'kenga-grid/columns/nodes/marker-service-node';
import Grid from 'kenga-grid/grid';
import Label from 'kenga-labels/label';

class KengaWidgets {
    constructor () {
        const grdPets = new Grid();
        this.grdPets = grdPets;
        const colService = new MarkerServiceNode();
        this.colService = colService;
        const colName = new ColumnNode();
        this.colName = colName;
        const colType = new ColumnNode();
        this.colType = colType;
        const colDateOfBirth = new ColumnNode();
        this.colDateOfBirth = colDateOfBirth;
        const surface = new AnchorsPane();
        this.surface = surface;
        const btnSignOut = new Button();
        this.btnSignOut = btnSignOut;
        const lblAvatar = new Label();
        this.lblAvatar = lblAvatar;
        const lblSignedInAs = new Label();
        this.lblSignedInAs = lblSignedInAs;
        surface.add(grdPets);
        surface.add(btnSignOut);
        surface.add(lblAvatar);
        surface.add(lblSignedInAs);
        grdPets.addColumnNode(colService);
        grdPets.addColumnNode(colName);
        grdPets.addColumnNode(colType);
        grdPets.addColumnNode(colDateOfBirth);
        {
            grdPets.element.style.left = '25px';
            grdPets.element.style.right = '25px';
            grdPets.element.style.top = '125px';
            grdPets.element.style.bottom = '25px';
        }
        {

        }
        {
            colName.title = 'Name';
        }
        {
            colType.title = 'Type';
            colType.width = 92;
        }
        {
            colDateOfBirth.title = 'Date of birth';
            colDateOfBirth.width = 211;
        }
        {
            surface.element.style.width = '500px';
            surface.element.style.height = '500px';
        }
        {
            btnSignOut.text = 'Выход';
            btnSignOut.element.style.width = '98px';
            btnSignOut.element.style.right = '12px';
            btnSignOut.element.style.top = '25px';
            btnSignOut.element.style.height = '30px';
        }
        {
            lblAvatar.toolTipText = 'Вход не выполнен';
            lblAvatar.text = null;
            lblAvatar.classes = 'a-avatar-small';
            lblAvatar.element.className += ' ' + lblAvatar.classes;
            lblAvatar.element.style.width = '40px';
            lblAvatar.element.style.right = '122px';
            lblAvatar.element.style.top = '20px';
            lblAvatar.element.style.height = '40px';
        }
        {
            lblSignedInAs.text = 'Вход не выполнен';
            lblSignedInAs.element.style.right = '168px';
            lblSignedInAs.element.style.top = '33px';
        }
    }
}
export default KengaWidgets;