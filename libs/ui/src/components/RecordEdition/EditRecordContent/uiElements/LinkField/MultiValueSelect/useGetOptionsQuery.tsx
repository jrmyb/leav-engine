// Copyright LEAV Solutions 2017
// This file is released under LGPL V3
// License text available at https://www.gnu.org/licenses/lgpl-3.0.txt
import {useQuery} from '@apollo/client';
import {RecordFormAttributeLinkAttributeFragment, SortOrder} from '_ui/_gqlTypes';
import {
    IGetRecordsFromLibraryQuery,
    IGetRecordsFromLibraryQueryVariables,
    getRecordsFromLibraryQuery
} from '_ui/_queries/records/getRecordsFromLibraryQuery';
import {RecordFormElementsValueLinkValue} from '_ui/hooks/useGetRecordForm';
import {IRecordIdentity} from '_ui/types';
import {KitAvatar, KitSelect} from 'aristid-ds';
import {ComponentProps, useMemo} from 'react';

export const useGetOptionsQuery = ({
    attribute,
    onSelectChange
}: {
    attribute: RecordFormAttributeLinkAttributeFragment;
    onSelectChange: (values: Array<{value: IRecordIdentity; idValue: string}>) => void;
}) => {
    let loading: boolean;
    let data: IGetRecordsFromLibraryQuery;

    if (attribute.linkValuesList?.enable) {
        loading = false;
        data = {records: {list: attribute.linkValuesList.values, totalCount: attribute.linkValuesList.values.length}};
    } else {
        ({loading, data} = useQuery<IGetRecordsFromLibraryQuery, IGetRecordsFromLibraryQueryVariables>(
            getRecordsFromLibraryQuery(),
            {
                fetchPolicy: 'network-only',
                variables: {
                    library: attribute.linked_library.id,
                    limit: 1_000,
                    sort: {
                        field: 'label',
                        order: SortOrder.asc
                    }
                }
            }
        ));
    }

    const recordList = useMemo(() => data?.records?.list ?? [], [data]);

    const selectOptions = useMemo<ComponentProps<typeof KitSelect>['options']>(
        () =>
            recordList.map(recordItem => {
                const recordLabel = recordItem.whoAmI.label ?? recordItem.whoAmI.id;

                return {
                    value: recordItem.whoAmI.id,
                    label: recordLabel,
                    idCard: {
                        description: recordLabel,
                        avatarProps: {
                            size: 'small',
                            shape: 'square',
                            imageFit: 'contain',
                            src: recordItem.whoAmI.preview?.small,
                            label: recordLabel
                        }
                    }
                };
            }),
        [recordList]
    );

    const updateLeavField = (valuesToAdd: string[], valuesToRemove: RecordFormElementsValueLinkValue[]) => {
        const formattedValuesToAdd = recordList
            .filter(record => valuesToAdd.includes(record.id))
            .map(value => ({value, idValue: null}));

        const formattedValuesToRemove = valuesToRemove.map(cv => ({
            idValue: cv.id_value,
            value: null
        }));

        return onSelectChange([...formattedValuesToAdd, ...formattedValuesToRemove]);
    };

    return {loading, selectOptions, updateLeavField};
};
