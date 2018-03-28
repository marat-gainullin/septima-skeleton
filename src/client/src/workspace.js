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
        const lblSignedInAs = new Label();
        this.lblSignedInAs = lblSignedInAs;
        surface.add(grdPets);
        surface.add(btnSignOut);
        surface.add(lblSignedInAs);
        grdPets.addColumnNode(colService);
        grdPets.addColumnNode(colName);
        grdPets.addColumnNode(colType);
        grdPets.addColumnNode(colDateOfBirth);
        {
            grdPets.element.style.left = '51px';
            grdPets.element.style.width = '402px';
            grdPets.element.style.top = '125px';
            grdPets.element.style.height = '338px';
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
            btnSignOut.element.style.right = '20px';
            btnSignOut.element.style.top = '39px';
            btnSignOut.element.style.height = '30px';
        }
        {
            lblSignedInAs.text = 'Вход не выполнен';
            lblSignedInAs.element.style.right = '20px';
            lblSignedInAs.element.style.top = '11px';
        }
    }
}
export default KengaWidgets;