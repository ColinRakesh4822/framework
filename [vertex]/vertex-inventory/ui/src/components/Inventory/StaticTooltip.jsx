import React from 'react';
import { Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Moment from 'react-moment';

import { getItemLabel } from './item';

const ignoredFields = [
	'ammo',
	'clip',
	'CreateDate',
	'Container',
	'Quality',
	'mask',
	'accessory',
	'watch',
	'hat',
	'BankId',
	'VpnName',
	'EvidenceCoords',
	'EvidenceType',
	'EvidenceWeapon',
	'EvidenceDNA',
	'WeaponTint',
	'CustomItemLabel',
	'CustomItemImage',
	'Items',
	'Department',
	'Scratched',
	'PoliceWeaponId',
	'Mugshot',
	'MethTable',
	'CustomAmt',
];

const lua2json = (lua) =>
	JSON.parse(
		lua
			.replace(/\[([^\[\]]+)\]\s*=/g, (s, k) => `${k} :`)
			.replace(/,(\s*)\}/gm, (s, k) => `${k}}`),
	);

export default ({ item, instance }) => {
	const metadata = Boolean(instance?.MetaData)
		? typeof instance?.MetaData == 'string'
			? lua2json(instance.MetaData)
			: instance.MetaData
		: Object();

	const items = useSelector((state) => state.inventory.items);

	const calcDurability = () => {
		if (!Boolean(instance?.CreateDate) || !Boolean(item?.durability)) null;
		return Math.ceil(
			100 -
				((Math.floor(Date.now() / 1000) - instance?.CreateDate) /
					item?.durability) *
					100,
		);
	};

	const durability = calcDurability();

	const useStyles = makeStyles((theme) => ({
		body: {
		  // Added some base styles for better defaults
		  margin: 0,
		  padding: 0,
		  boxSizing: 'border-box',
		},
		itemName: {
		  fontSize: '1.5rem', // 24px in rem
		  color: theme.palette.text.main,
		  fontWeight: 600, // Added for better typography
		  lineHeight: 1.2, // Better line height for headings
		},
		itemType: {
		  fontSize: '1rem', // 16px in rem
		  color: Boolean(theme.palette.rarities[`rare${item.rarity}`])
			? theme.palette.rarities[`rare${item.rarity}`]
			: theme.palette.text.main,
		  fontWeight: 500, // Medium weight for better hierarchy
		},
		usable: {
		  fontSize: '1rem',
		  color: theme.palette.success.light,
		  display: 'inline-flex', // Better alignment
		  alignItems: 'center',
		  '&::before': {
			color: theme.palette.text.main,
			content: '" - "',
		  },
		},
		tooltipDetails: {
		  marginTop: '0.25rem', // 4px in rem
		  paddingTop: '0.25rem',
		  borderTop: `1px solid ${theme.palette.border.input}`,
		  borderRadius: '0.125rem', // Subtle rounded corners
		},
		tooltipValue: {
		  fontSize: '0.875rem', // 14px in rem
		  color: theme.palette.text.alt,
		  lineHeight: 1.5, // Better readability
		},
		stackable: {
		  fontSize: '0.625rem', // 10px in rem
		  marginLeft: '0.125rem', // 2px in rem
		  fontWeight: 500, // Medium weight for better visibility
		},
		durability: {
		  fontSize: '0.875rem',
		  color: isNaN(durability)
			? theme.palette.text.alt
			: durability >= 75
			? theme.palette.success.light
			: durability >= 50
			? theme.palette.warning.light
			: theme.palette.error.light,
		  fontWeight: 500, // Medium weight for better visibility
		  '&::after': {
			content: '"%"',
		  },
		},
		broken: {
		  fontSize: '0.875rem',
		  color: theme.palette.error.light,
		  fontWeight: 500, // Medium weight for emphasis
		},
		itemPrice: {
		  fontSize: '0.875rem',
		  color: theme.palette.success.main,
		  display: 'inline-flex', // Better alignment
		  alignItems: 'center',
		  fontWeight: 500, // Medium weight for better visibility
		  '&::before': {
			content: '"$"',
			marginRight: '0.125rem', // 2px in rem
			marginLeft: '0.5rem', // 8px in rem
			color: theme.palette.text.main,
		  },
		},
		description: {
		  paddingLeft: '1.25rem', // 20px in rem
		  fontSize: '1rem',
		  color: theme.palette.text.alt,
		  lineHeight: 1.6, // Better readability for paragraphs
		},
		metadata: {
		  marginTop: '0.625rem', // 10px in rem
		  paddingTop: '0.625rem',
		  borderTop: `1px solid ${theme.palette.border.input}`,
		  fontSize: '0.875rem',
		  color: theme.palette.text.alt,
		  lineHeight: 1.5, // Better readability
		},
		metafield: {
		  '& b': {
			fontSize: '1rem',
			fontWeight: 600, // Bolder for better contrast
		  },
		},
		qualifications: {
		  fontSize: '0.875rem',
		  marginTop: '0.25rem', // 4px in rem
		  paddingTop: '0.25rem',
		  borderTop: `1px solid ${theme.palette.border.input}`,
		  display: 'flex', // Better alignment with icons
		  alignItems: 'center',
		  '& svg': {
			marginRight: '0.625rem', // 10px in rem
		  },
		},
		inelig: {
		  color: theme.palette.error.light,
		  display: 'flex', // Better alignment with icons
		  alignItems: 'center',
		},
		elig: {
		  color: theme.palette.success.light,
		  display: 'flex', // Better alignment with icons
		  alignItems: 'center',
		},
		attachFitment: {
		  fontSize: '0.875rem',
		  '& li': {
			fontSize: '0.75rem', // 12px in rem
			marginBottom: '0.25rem', // Added spacing between list items
		  },
		},
		title: {
		  display: 'flex', // Better alignment with icons
		  alignItems: 'center',
		  '& svg': {
			marginRight: '0.375rem', // 6px in rem
			color: 'gold',
		  },
		},
		attchList: {
		  marginLeft: '-0.375rem', // -6px in rem
		  listStyle: 'none',
		  padding: 0, // Reset default padding
		  margin: '0.5rem 0', // Added vertical spacing
		},
		attchSlot: {
		  textTransform: 'capitalize',
		  fontWeight: 500, // Medium weight for better visibility
		},
		paper: {
		  padding: '1.25rem', // 20px in rem
		  border: `1px solid ${theme.palette.border.divider}`,
		  width: 'fit-content',
		  height: 'fit-content',
		  minWidth: '15.625rem', // 250px in rem
		  position: 'absolute',
		  right: '2%',
		  top: 0,
		  bottom: 0,
		  margin: 'auto',
		  borderRadius: '0.5rem', // Added rounded corners
		  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // Subtle shadow
		  transition: 'box-shadow 0.2s ease', // Smooth transition for hover effects
		  '&:hover': {
			boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // Enhanced shadow on hover
		  },
		},
	  }));
	const classes = useStyles();

	const getTypeLabel = () => {
		switch (item.type) {
			case 1:
				return 'Consumable';
			case 2:
				return 'Weapon';
			case 3:
				return 'Tool';
			case 4:
				return 'Crafting Ingredient';
			case 5:
				return 'Collectable';
			case 6:
				return 'Junk';
			case 8:
				return 'Evidence';
			case 9:
				return 'Ammunition';
			case 10:
				return 'Container';
			case 11:
				return 'Gem';
			case 12:
				return 'Paraphernalia';
			case 13:
				return 'Wearable';
			case 14:
				return 'Contraband';
			case 15:
				return 'Collectable (Gang Chain)';
			case 16:
				return 'Weapon Attachment';
			case 17:
				return 'Crafting Schematic';
			default:
				return 'Unknown';
		}
	};

	const getRarityLabel = () => {
		// console.log('ERROR HANDLER BY KR',item.rarity)
		switch (item.rarity) {
			case 1:
				return 'Common';
			case 2:
				return 'Uncommon';
			case 3:
				return 'Rare';
			case 4:
				return 'Epic';
			case 5:
				return 'Objective';
			default:
				return 'Dogshit';
		}
	};

	const isDataBlacklisted = (key) => {
		return ignoredFields.includes(key);
	};

	const getDataLabel = (key, value) => {
		switch (key) {
			case 'SerialNumber':
				return (
					<span className={classes.metafield}>
						<b>Serial Number</b>: {value}
					</span>
				);
			case 'ScratchedSerialNumber':
				return (
					<span className={classes.metafield}>
						<b>Serial Number</b>: {'<scratched off>'}
					</span>
				);
			case 'StateID':
				return (
					<span className={classes.metafield}>
						<b>State ID</b>: {value}
					</span>
				);
			case 'PassportID':
				return (
					<span className={classes.metafield}>
						<b>Passport ID</b>: {value}
					</span>
				);
			case 'DOB':
				return (
					<span className={classes.metafield}>
						<b>Date of Birth</b>:
						<Moment date={value * 1000} format="YYYY/MM/DD" />
					</span>
				);
			case 'EvidenceAmmoType':
				return (
					<span className={classes.metafield}>
						<b>Ammo Type</b>: {value}
					</span>
				);
			case 'EvidenceId':
				return (
					<span className={classes.metafield}>
						<b>Evidence ID</b>: {value}
					</span>
				);
			case 'EvidenceColor':
				return (
					<span
						className={classes.metafield}
						style={{
							color: `rgb(${value.r} ${value.g} ${value.b})`,
						}}
					>
						<b>Fragment Color</b>:{' '}
						{`R: ${value.r} G: ${value.g} B: ${value.b}`}
					</span>
				);
			case 'EvidenceDegraded':
				return (
					<span className={classes.metafield}>
						<b>Evidence Degraded</b>: {value ? 'Yes' : 'No'}
					</span>
				);
			case 'EvidenceBloodPool':
				return (
					<span className={classes.metafield}>
						{value ? 'Pool of Blood' : 'Drops of Blood'}
					</span>
				);
			case 'CustomItemText':
				return <span className={classes.metafield}>{value}</span>;
			case 'VaultCode':
				return (
					<span className={classes.metafield}>
						<b>Vault Access Code</b>: {value}
					</span>
				);
			case 'BranchName':
				return (
					<span className={classes.metafield}>
						<b>Fleeca Branch</b>: {value}
					</span>
				);
			case 'Finished':
				return (
					<span className={classes.metafield}>
						<b>Ready</b>:{' '}
						{<Moment unix date={value} fromNow interval={60000} />}
					</span>
				);
			case 'CryptoCoin':
				return (
					<span className={classes.metafield}>
						<b>Currency</b>: ${value}
					</span>
				);
			case 'ChopList':
				return (
					<span className={classes.metafield}>
						<b>Request List</b>:{' '}
						<ul>
							{value.length > 0 ? (
								value
									.sort((a, b) => b.hv - a.hv)
									.map((chop, i) => {
										return (
											<li
												key={`chop-${i}`}
												className={classes.title}
											>
												{chop.hv && (
													<FontAwesomeIcon
														icon={[
															'fas',
															'diamond-exclamation',
														]}
													/>
												)}
												{chop.name}
											</li>
										);
									})
							) : (
								<b>No Vehicles On Chop List</b>
							)}
						</ul>
					</span>
				);
			case 'WeaponComponents':
				if (Object.keys(value).length == 0) return null;
				return (
					<span className={classes.metafield}>
						<b>Weapon Attachments</b>:{' '}
						<ul className={classes.attchList}>
							{Object.keys(value).map((attachKey) => {
								let attach = value[attachKey];
								let atchItem = items[attach.item];
								if (!Boolean(atchItem)) return null;
								return (
									<li>
										<b className={classes.attchSlot}>
											{attachKey}:{' '}
										</b>
										{atchItem.label}
									</li>
								);
							})}
						</ul>
					</span>
				);
			case 'AccessCodes':
				if (value.length == 0) return null;
				return (
					<span className={classes.metafield}>
						<b>Access Codes</b>:{' '}
						<ul className={classes.attchList}>
							{value.map((code) => {
								return (
									<li>
										<b className={classes.attchSlot}>
											{code.label}:{' '}
										</b>
										{code.code}
									</li>
								);
							})}
						</ul>
					</span>
				);
			default:
				return (
					<span className={classes.metafield}>
						<b>{key}</b>: {value}
					</span>
				);
		}
	};

	if (!Boolean(item) || !Boolean(instance)) return null;
	return (
		<Paper className={classes.paper}>
			<div className={classes.body}>
				<div className={classes.itemName}>
					{getItemLabel(instance, item)}
				</div>
				<div className={classes.itemType}>
					{`${getRarityLabel()} ${getTypeLabel()}`}
					{item.isUsable && (
						<span className={classes.usable}>Usable</span>
					)}
				</div>
				{Boolean(instance?.id) && (
					<div>
						ID:{' '}
						<span className={classes.tooltipValue}>
							{instance?.id}
						</span>
					</div>
				)}

				{Boolean(item.description) && (
					<div className={classes.description}>
						{item.description}
					</div>
				)}

				{Boolean(item?.component) && (
					<div className={classes.attachFitment}>
						<span className={classes.metafield}>
							<b>Attachment Fits On</b>:{' '}
							<ul className={classes.attchList}>
								{Object.keys(item.component.strings).length <=
								10 ? (
									Object.keys(item.component.strings).map(
										(weapon) => {
											let wepItem = items[weapon];
											if (!Boolean(wepItem)) return null;
											return <li>{wepItem.label}</li>;
										},
									)
								) : (
									<span>Fits On Most Weapons</span>
								)}
							</ul>
						</span>
					</div>
				)}
				{Boolean(item.schematic) &&
					Boolean(items[item.schematic.result.name]) && (
						<div className={classes.attachFitment}>
							<span className={classes.metafield}>
								<b>Teaches</b>:
								{` Crafting x${item.schematic.result.count} ${
									items[item.schematic.result.name].label
								}`}
							</span>
						</div>
					)}
				{Boolean(metadata) &&
					Object.keys(metadata).length > 0 &&
					Object.keys(metadata).filter((k) => !isDataBlacklisted(k))
						.length > 0 && (
						<div className={classes.metadata}>
							{Object.keys(metadata)
								.filter((k) => !isDataBlacklisted(k))
								.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
								.map((k) => {
									return (
										<div key={`${instance?.Slot}-${k}`}>
											{getDataLabel(k, metadata[k])}
										</div>
									);
								})}
						</div>
					)}
				<div className={classes.tooltipDetails}>
					Weight:{' '}
					<span className={classes.tooltipValue}>
						{item?.weight || 0} lbs
						{instance.Count > 1 && (
							<span className={classes.stackable}>
								(Total: {(item?.weight || 0) * instance.Count}{' '}
								lbs)
							</span>
						)}
					</span>
					{' | '}Count:{' '}
					<span className={classes.tooltipValue}>
						{instance.Count}
						{Boolean(item.isStackable) && item.isStackable > 0 && (
							<span className={classes.stackable}>
								(Max Stack: {item.isStackable})
							</span>
						)}
					</span>
					{!isNaN(durability) &&
						(durability > 0 ? (
							<>
								<p>
									Durability: {Math.trunc(durability)}%
								</p>
								<div style={{
									background: 'rgba(0, 0, 0, 0.4)',
									border: '1px solid #222',
									height: '6px',
									borderRadius: '6px',
									overflow: 'hidden',
									margin: '4px 0',
									width: '100%',
								}}>
									<div style={{
										visibility: durability > 0 ? 'visible' : 'hidden',
										height: '100%',
										borderRadius: '5px',
										transition: 'background 0.3s ease, width 0.3s ease',
										backgroundColor: durability < 50
											? `rgb(${Math.round(245 - (245 - 0) * (durability / 50))}, ${Math.round(158 - (158 - 158) * (durability / 50))}, ${Math.round(11 - (11 - 32) * (durability / 50))})`
											: `rgb(${Math.round(0 + (196 - 0) * ((durability - 50) / 50))}, ${Math.round(158 + (196 - 158) * ((durability - 50) / 50))}, ${Math.round(32 + (40 - 32) * ((durability - 50) / 50))})`,
										width: `${durability}%`,
									}} />
								</div>
							</>
						) : (
							<p>
								Durability: <span className={classes.broken}>Broken</span>
							</p>
						))}
				</div>
			</div>
		</Paper>
	);
};
