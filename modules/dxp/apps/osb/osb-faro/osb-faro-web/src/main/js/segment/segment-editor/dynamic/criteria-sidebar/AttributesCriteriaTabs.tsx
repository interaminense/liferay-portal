import ClayTabs from '@clayui/tabs';
import CriteriaSidebarItem from './CriteriaSidebarItem';
import React, {useState} from 'react';
import {getDefaultValue} from './CriteriaSidebarCollapse';
import {List} from 'immutable';
import {Property} from 'shared/util/records';

const DEFAULT_TAB = 0;

const filterProperties = (
	properties: List<Property>,
	searchValue: string
): List<Property> =>
	searchValue
		? (properties.filter(property =>
				(property?.label ?? '')
					.toLowerCase()
					.includes(searchValue.toLowerCase())
		  ) as List<Property>)
		: properties;

const renderProperties = (properties: List<Property>) => (
	<ul className='property-subgroups-list active'>
		<li>
			<ul className='properties-list'>
				{properties.toArray().map((property, i) => {
					const {label, name, propertyKey, type} = property;

					return (
						<CriteriaSidebarItem
							className={`color--${propertyKey}`}
							defaultValue={getDefaultValue(property)}
							key={`${name}-${i}`}
							label={label}
							name={name}
							property={property}
							propertyKey={propertyKey}
							type={type}
						/>
					);
				})}
			</ul>
		</li>
	</ul>
);

interface IAttributesCriteriaTabsProps {
	customProperties: List<Property>;
	defaultProperties: List<Property>;
	searchValue: string;
}

const AttributesCriteriaTabs: React.FC<IAttributesCriteriaTabsProps> = ({
	customProperties,
	defaultProperties,
	searchValue
}) => {
	const [activeTab, setActiveTab] = useState<number>(DEFAULT_TAB);

	const properties =
		activeTab === DEFAULT_TAB ? defaultProperties : customProperties;

	return (
		<div className='events-criteria-tabs'>
			<ClayTabs active={activeTab} onActiveChange={setActiveTab}>
				<ClayTabs.Item>{Liferay.Language.get('default')}</ClayTabs.Item>

				<ClayTabs.Item>{Liferay.Language.get('custom')}</ClayTabs.Item>
			</ClayTabs>

			<div className='events-criteria-tabs-content mt-3'>
				{renderProperties(filterProperties(properties, searchValue))}
			</div>
		</div>
	);
};

export default AttributesCriteriaTabs;
