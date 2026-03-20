import React from 'react';
import { makeStyles } from '@mui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Moment from 'react-moment';

import { FormatThousands, Sanitize } from '../../util/Parser';
import { getItemLabel } from './item';
import { List, ListItem, ListItemText } from '@mui/material';
import { useSelector } from 'react-redux';

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

export default ({
	item,
	instance,
	durability,
	invType,
	shop = false,
	free = false,
	rarity = false,
	isEligible = false,
	isQualified = false,
}) => {
	const metadata = Boolean(instance?.MetaData)
		? typeof instance?.MetaData == 'string'
			? lua2json(instance.MetaData)
			: instance.MetaData
		: Object();

	const items = useSelector((state) => state.inventory.items);
	const useStyles = makeStyles((theme) => ({
	body: {
		width: 'fit-content',
		maxWidth: 250,
		display: 'flex',
		flexDirection: 'column',
		gap: 8,
		zIndex: '999999 !important',
		position: 'relative',
	},
		itemName: {
			fontSize: 16,
			color: '#ffffff',
			background: 'rgba(0, 0, 0, 0.8)',
			padding: '8px',
			borderRadius: '6px',
			border: '1px solid rgb(105, 105, 105)',
			fontWeight: 'bold',
			textTransform: 'uppercase',
			wordWrap: 'break-word',
			whiteSpace: 'normal',
		},
		itemType: {
			fontSize: 16,
			color: Boolean(theme.palette.rarities[`rare${item.rarity}`])
				? theme.palette.rarities[`rare${item.rarity}`]
				: theme.palette.text.main,
			background: 'rgba(20, 69, 3, 0.9)',
			padding: '10px 16px',
			borderRadius: '6px',
			border: '1px solid rgba(255, 255, 255, 0.1)',
		},
		usable: {
			fontSize: 16,
			color: theme.palette.success.light,
			'&::before': {
				color: theme.palette.text.main,
				content: '" - "',
			},
		},
		tooltipDetails: {
			marginTop: 0,
			paddingTop: 0,
			borderTop: 'none',
			background: 'rgba(45, 127, 72, 0.8)',
			padding: '12px 16px',
			borderRadius: '6px',
			border: '1px solid rgba(255, 255, 255, 0.1)',
		},
		tooltipValue: {
			fontSize: 14,
			color: theme.palette.text.alt,
		},
		stackable: {
			fontSize: 10,
			marginLeft: 2,
		},
		quality: {
			fontSize: 14,
			color: isNaN(instance?.Quality)
				? theme.palette.text.alt
				: instance?.Quality >= 75
				? theme.palette.success.light
				: instance?.Quality >= 50
				? theme.palette.warning.light
				: theme.palette.error.light,
			'&::after': {
				content: '"%"',
			},
		},
		durability: {
			fontSize: 14,
			color: isNaN(durability)
				? theme.palette.text.alt
				: durability >= 75
				? theme.palette.success.light
				: durability >= 50
				? theme.palette.warning.light
				: theme.palette.error.light,
			'&::after': {
				content: '"%"',
			},
		},
		broken: {
			fontSize: 14,
			color: theme.palette.error.light,
		},
		itemPrice: {
			fontSize: 14,
			color: theme.palette.success.main,
			'&::before': {
				content: '"$"',
				marginRight: 2,
				marginLeft: 8,
				color: theme.palette.text.main,
			},
		},
		description: {
			fontSize: 16,
			color: '#666666',
			background: 'rgba(0, 0, 0, 0.8)',
			padding: '8px',
			borderRadius: '6px',
			border: '1px solid rgb(105, 105, 105)',
			fontWeight: '400',
			textTransform: 'none',
			wordWrap: 'break-word',
			whiteSpace: 'normal',
		},
		metadata: {
			marginTop: 0,
			paddingTop: 0,
			borderTop: 'none',
			background: 'rgba(0, 0, 0, 0.8)',
			padding: '8px',
			borderRadius: '6px',
			border: '1px solid rgb(105, 105, 105)',
			fontSize: 14,
			color: '#ffffff',
			fontWeight: 'bold',
			textTransform: 'uppercase',
		},
		metafield: {
			display: 'flex',
			flexDirection: 'column',
			marginBottom: '4px',
			'& b': {
				fontSize: 14,
				color: '#666666',
				fontWeight: 400,
				marginBottom: '2px',
			},
			'& span:not(b)': {
				color: '#ffffff',
				fontWeight: 'bold',
				fontSize: 14,
			},
		},
		qualifications: {
			fontSize: 14,
			marginTop: 0,
			paddingTop: 0,
			borderTop: 'none',
			background: 'rgba(0, 0, 0, 0.8)',
			padding: '8px',
			borderRadius: '6px',
			border: '1px solid rgb(105, 105, 105)',
			fontWeight: 'bold',
			textTransform: 'uppercase',
			color: '#ffffff',
			'& svg': {
				marginRight: 10,
			},
		},
		inelig: {
			color: theme.palette.error.light,
		},
		elig: {
			color: theme.palette.success.light,
		},
		attachFitment: {
			fontSize: 14,
			background: 'rgba(90, 255, 145, 0.8)',
			padding: '12px 16px',
			borderRadius: '6px',
			border: '1px solid rgba(255, 255, 255, 0.1)',
			'& li': {
				fontSize: 12,
			},
		},
		title: {
			'& svg': {
				marginRight: 6,
				color: 'gold',
			},
		},
		attchList: {
			marginLeft: -6,
			listStyle: 'none',
		},
		attchSlot: {
			textTransform: 'capitalize',
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
					<div className={classes.metafield}>
						<b>Serial Number</b>
						<span>{value}</span>
					</div>
				);
			case 'ScratchedSerialNumber':
				return (
					<div className={classes.metafield}>
						<b>Serial Number</b>
						<span>{'<scratched off>'}</span>
					</div>
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
					<div className={classes.metafield}>
						<b>{key}</b>
						<span>{value}</span>
					</div>
				);
		}
	};

	if (!Boolean(item) || !Boolean(instance)) return null;
	return (
		<div className={classes.body}>
			<div className={classes.itemName}>
				{getItemLabel(instance, item)}
			</div>
			{Boolean(item?.durability) && Boolean(instance?.CreateDate) && (
				<div className={classes.metadata}>
					<div className={classes.metafield}>
						<b>Durability</b>
						<span className={classes.durability}>
							{isNaN(durability) ? 'N/A' : `${Math.max(0, durability)}`}
						</span>
					</div>
				</div>
			)}
			{Boolean(item.description) && (
				<div
					className={classes.description}
					dangerouslySetInnerHTML={{
						__html: Sanitize(item.description),
					}}
				></div>
			)}
			{shop &&
				((item.type == 2 && item.requiresLicense) ||
					Boolean(item.qualification)) && (
					<div className={classes.qualifications}>
						{item.type == 2 && item.requiresLicense && shop && (
							<div
								className={
									isEligible ? classes.elig : classes.inelig
								}
							>
								{isEligible ? (
									<FontAwesomeIcon
										icon={['fas', 'circle-check']}
									/>
								) : (
									<FontAwesomeIcon icon={['fas', 'x']} />
								)}
								Requires Weapons Permit
							</div>
						)}
						{shop && Boolean(item.qualification) && (
							<div
								className={
									isQualified ? classes.elig : classes.inelig
								}
							>
								{isQualified ? (
									<FontAwesomeIcon
										icon={['fas', 'circle-check']}
									/>
								) : (
									<FontAwesomeIcon icon={['fas', 'x']} />
								)}
								Requires Additional Qualification
							</div>
						)}
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

		</div>
	);
};
