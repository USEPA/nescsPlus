import {ToggleItem} from './toggle-item.model';
import {ListItem} from './listItem';
import {Column} from './column.model';
import {NavItem} from './nav-item.model';
import {NavArray} from './nav-array.model';

export class Constants {

  // Groupings can not be determined automatically so the definition of groupings are done here
  // FindExpression used to determine id from designated indexColumnName which could be either NESCPlusID or BeneficiaryId
  public static get ENVIRONMENTAL_COLUMN_ARRAY(): NavArray {
    return new NavArray({
      baseName: 'environmental',
      indexColumnName: 'NESCSPlusID',
      index: 0,
      columnArray: [
        new Column({
          columnName: 'EnvironmentalClass',
          columnTitle: 'Environmental Class',
          className: 'greenBackground',
          arrayIndex: 0,
          level: 0,
          findExpression: /(\d)/
        }),
        new Column({
          columnName: 'EnvironmentalSubclassI',
          columnTitle: 'Environmental Subclass I',
          className: 'greenBackground',
          arrayIndex: 0,
          level: 1,
          findExpression: /(\d{2})/
        }),
        new Column({
          columnName: 'EnvironmentalSubclassII',
          columnTitle: 'Environmental Subclass II',
          className: 'greenBackground',
          arrayIndex: 0,
          level: 1,
          findExpression: /(\d{2}.)/
        })
      ]
    });
  }

  public static get ECOLOGICAL_COLUMN_ARRAY(): NavArray {
    return new NavArray({
      baseName: 'ecological',
      indexColumnName: 'NESCSPlusID',
      index: 1,
      columnArray: [
        new Column({
          columnName: 'EcologicalClass',
          columnTitle: 'Ecological End-Product Class',
          className: 'lightGreenBackground',
          arrayIndex: 1,
          level: 0,
          findExpression: /\.(\d)/
        })]
    });
  }

  public static get DIRECTUSE_COLUMN_ARRAY(): NavArray {
    return new NavArray({
      baseName: 'directUse',
      indexColumnName: 'NESCSPlusID',
      index: 2,
      columnArray: [
        new Column({
          columnName: 'DirectUseClass',
          columnTitle: 'Direct Use/Non-Use Class',
          className: 'darkBlueBackground',
          arrayIndex: 2,
          level: 0,
          findExpression: /\..\.(\d)/
        }),
        new Column({
          columnName: 'DirectUseSubclassI',
          columnTitle: 'Direct Use/Non-Use Subclass I',
          className: 'darkBlueBackground',
          arrayIndex: 2,
          level: 1,
          findExpression: /\..\.(\d{3})/
        }),
        new Column({
          columnName: 'DirectUseSubclassII',
          columnTitle: 'Direct Use/Non-Use Subclass II',
          className: 'darkBlueBackground',
          arrayIndex: 2,
          level: 2,
          findExpression: /\..\.(\d{4})/
        })
      ]
    });
  }

  public static get DIRECTUSER_COLUMN_ARRAY(): NavArray {
    return new NavArray({
      baseName: 'directUser',
      indexColumnName: 'NESCSPlusID',
      index: 3,
      columnArray: [
        new Column({
          columnName: 'DirectUserClass',
          columnTitle: 'Direct User Class',
          className: 'lightBlueBackground',
          level: 3,
          arrayIndex: 0,
          findExpression: /\..{7}(\d)/
        }),
        new Column({
          columnName: 'DirectUserSubclassI',
          columnTitle: 'Direct User Subclass I',
          className: 'lightBlueBackground',
          arrayIndex: 3,
          level: 1,
          findExpression: /\..{7}(\d{3})/
        }),
        new Column({
          columnName: 'DirectUserSubclassII',
          columnTitle: 'Direct User Subclass II',
          className: 'lightBlueBackground',
          arrayIndex: 3,
          level: 2,
          findExpression: /\..{7}(.{4})/
        })]
    });
  }

  public static get BENEFICIARY_COLUMN_ARRAY(): NavArray {
    return new NavArray({
      baseName: 'beneficiary',
      indexColumnName: 'BeneficiaryId',
      index: 0, // Determine which portion of id to use based on id split by '.'
      columnArray: [
        new Column({
          columnName: 'BeneficiaryCategory',
          columnTitle: 'Beneficiary Category',
          className: 'blueBackground',
          arrayIndex: 4,
          level: 0,
          findExpression: /(.{2})/
        }),
        new Column({
          columnName: 'BeneficiarySubcategory',
          columnTitle: 'Beneficiary Subcategory',
          className: 'blueBackground',
          arrayIndex: 4,
          level: 1,
          findExpression: /(.{4})/
        })]
    });
  }

  public static get BENEFICIARY_ID_COLUMN(): NavArray {
    return new NavArray({
      baseName: 'beneficiaryId',
      columnArray: [
        new Column({columnName: 'BeneficiaryId', columnTitle: 'Beneficiary Id', arrayIndex: 0, level: 0})
      ]
    });
  }

  // public static get ANCILIARY_COLUMN_ARRAY(): Array<string> {
  //   return ['Importance', 'Status', 'Source', 'Notes', 'MeasurementType', 'FEGSMeasurementincludingUnits'];
  // }

  public static get ID_COLUMN(): NavArray {
    return new NavArray({
      baseName: 'id',
      columnArray: [
        new Column({columnName: 'NESCSPlusID', columnTitle: 'NESCS Plus ID', arrayIndex: 0, level: 0})
      ]
    });
  }

  public static COLUMN_MAP: Array<NavArray> = []
    .concat(Constants.ENVIRONMENTAL_COLUMN_ARRAY)
    .concat(Constants.ECOLOGICAL_COLUMN_ARRAY)
    .concat(Constants.DIRECTUSE_COLUMN_ARRAY)
    .concat(Constants.DIRECTUSER_COLUMN_ARRAY)
    .concat(Constants.BENEFICIARY_COLUMN_ARRAY)
    .concat(Constants.BENEFICIARY_ID_COLUMN)
    .concat(Constants.ID_COLUMN);

  public static TOGGLE_COLUMN_MAP: Array<ListItem> = new Array<ListItem>(
    new ListItem({
      title: 'Environmental Class',
      column: 'EnvironmentalClass',
      checked: true,
      style: '25',
      children: [
        new ListItem({
          title: 'Environmental Subclass',
          column: 'EnvironmentalSubclassI',
          checked: true,
          style: '25',
          children: []
        }),
        new ListItem({
          title: 'Environmental Subclass',
          column: 'EnvironmentalSubclassII',
          checked: true,
          style: '25',
          children: []
        })
      ]
    }),
    new ListItem({
      title: 'Ecological End-Product Class',
      column: 'EcologicalClass',
      checked: true,
      style: '5',
      children: []
    }),
    new ListItem({
      title: 'Direct Use/Non-Use Class',
      column: 'DirectUseClass',
      checked: true,
      style: '10',
      children: [
        new ListItem({
          title: 'Direct Use/Non-Use Subclass I',
          column: 'DirectUseSubclassI',
          checked: true,
          style: '10',
          children: [
            new ListItem({
              title: 'Direct Use/Non-Use Subclass II',
              column: 'DirectUseSubclassII',
              checked: true,
              style: '10',
              children: []
            })
          ]
        })
      ]
    }),
    new ListItem({
      title: 'Direct User Class',
      column: 'DirectUserClass',
      checked: true,
      style: '15',
      children: [
        new ListItem({
          title: 'Direct User Subclass I',
          column: 'DirectUserSubclassI',
          checked: true,
          style: '15',
          children: [
            new ListItem({
              title: 'Direct User Subclass II',
              column: 'DirectUserSubclassII',
              checked: true,
              style: '15',
              children: []
            })
          ]
        })
      ]
    }),
    new ListItem({
      column: 'BeneficiaryCategory',
      title: 'Beneficiary Category',
      checked: true,
      style: '20',
      children: [
        new ListItem({
          title: 'Beneficiary Subcategory',
          column: 'BeneficiarySubcategory',
          checked: true,
          style: '20',
          children: []
        })
      ]
    }),
    new ListItem({
      title: 'NESCS Plus ID',
      column: 'NESCSPlusID',
      checked: true,
      children: [],
      style: '0'
    }),
    new ListItem({
      title: 'Beneficiary Id',
      column: 'BeneficiaryId',
      checked: true,
      children: [],
      style: '0'
    })
  );

  public static EXCEL_COLUMNS = new Array<string>('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI',
    'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ');


}

