// Copyright LEAV Solutions 2017
// This file is released under LGPL V3
// License text available at https://www.gnu.org/licenses/lgpl-3.0.txt
import {PlusOutlined} from '@ant-design/icons';
import {ButtonProps} from 'antd';
import {themeVars} from '_ui/antdTheme';
import {BasicButton} from '_ui/components';
import {useSharedTranslation} from '_ui/hooks/useSharedTranslation';
import {FieldScope} from '../../_types';

interface IAddValueBtnProps extends ButtonProps {
    bordered?: boolean;
    linkField?: boolean;
    activeScope: FieldScope;
}

function AddValueBtn({bordered = false, linkField = false, activeScope, ...props}: IAddValueBtnProps): JSX.Element {
    const {t} = useSharedTranslation();
    return (
        <BasicButton
            bordered={bordered}
            {...props}
            style={{
                color:
                    activeScope === FieldScope.INHERITED
                        ? themeVars.inheritedValuesVersionColor
                        : themeVars.defaultTextColor
            }}
        >
            <PlusOutlined />
            {linkField ? t('record_edition.add_value_link') : t('record_edition.add_value')}
        </BasicButton>
    );
}

export default AddValueBtn;
