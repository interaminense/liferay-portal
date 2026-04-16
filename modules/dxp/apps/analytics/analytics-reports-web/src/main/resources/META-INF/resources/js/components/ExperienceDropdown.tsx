import {Option, Picker, Text} from '@clayui/core';
import React, {useContext, useEffect, useState} from 'react';
import ConnectionContext from '../context/ConnectionContext';
import { ChartDispatchContext } from '../context/ChartStateContext';

type Experience = {
    id: string | null;
    name: string;
};

interface ExperienceDropdownProps {
    experiencesDataProvider?: () => Promise<Experience[]>;
}

const ExperienceDropdown: React.FC<ExperienceDropdownProps> = ({experiencesDataProvider}) => {
    const dispatch = useContext(ChartDispatchContext);
    const {validAnalyticsConnection} = useContext(ConnectionContext);

    const ALL_EXPERIENCES: Experience = {id: null, name: Liferay.Language.get('all-experiences')};

    const [experiences, setExperiences] = useState<Experience[]>([ALL_EXPERIENCES]);

    useEffect(() => {
        if (validAnalyticsConnection && typeof experiencesDataProvider === 'function') {
            experiencesDataProvider()             
            .then((data) => {
                setExperiences([ALL_EXPERIENCES, ...(Array.isArray(data) ? data : [])]);
            });
        }
    }, [experiencesDataProvider, validAnalyticsConnection]);

    return (
        <div className="experience-dropdown">
            <Picker
                aria-label="Select Experience"
                className="border-light form-control-sm bg-white"
                items={experiences}
                defaultSelectedKey="all-experiences" 
                disabled={experiences.length <= 1}
                searchable
                onSelectionChange={(key) => {
                    dispatch({
                        payload: {key: key === 'all-experiences' ? null : key as string},
                        type: 'CHANGE_EXPERIENCE_ID_KEY',
                    });
                }}
            >
                {(item) => (
                   <Option key={item.id ?? 'all-experiences'} textValue={item.name}>
                        <div className="w-100">
                            <Text size={3}>{item.name}</Text>
                        </div>
                    </Option>
                )}
            </Picker>
        </div>
    );
};

export default ExperienceDropdown;