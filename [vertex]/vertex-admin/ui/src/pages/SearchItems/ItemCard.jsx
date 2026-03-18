import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const useStyles = makeStyles((theme) => ({
	card: {
		background: 'rgba(18, 16, 37, 0.96)',
		border: '1px solid rgba(32,134,146,0.15)',
		borderRadius: 2,
		padding: 12,
		cursor: 'pointer',
		transition: 'all 0.2s ease',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		'&:hover': {
			borderColor: 'rgba(32,134,146,0.5)',
			boxShadow: '0 0 16px rgba(32,134,146,0.15)',
		},
	},
	imageContainer: {
		width: '100%',
		height: 72,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 8,
		position: 'relative',
	},
	image: {
		maxWidth: 56,
		maxHeight: 56,
		objectFit: 'contain',
		filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4))',
	},
	placeholder: {
		fontSize: 24,
		color: 'rgba(32,134,146,0.3)',
	},
	label: {
		fontSize: 12,
		fontWeight: 600,
		fontFamily: "'Rajdhani', sans-serif",
		color: 'rgba(255, 255, 255, 0.9)',
		textAlign: 'center',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		width: '100%',
	},
	name: {
		fontSize: 9,
		color: 'rgba(255, 255, 255, 0.3)',
		textAlign: 'center',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		width: '100%',
		marginTop: 2,
		fontFamily: 'monospace',
	},
	badges: {
		display: 'flex',
		justifyContent: 'center',
		gap: 4,
		marginTop: 6,
		flexWrap: 'wrap',
	},
	badge: {
		fontSize: 8,
		padding: '2px 5px',
		borderRadius: 2,
		fontWeight: 700,
		fontFamily: "'Rajdhani', sans-serif",
		textTransform: 'uppercase',
		letterSpacing: '0.08em',
	},
	typeBadge: {
		background: 'rgba(32,134,146,0.15)',
		color: 'rgba(32,134,146,0.8)',
		border: '1px solid rgba(32,134,146,0.25)',
	},
}));

export default ({ item, onClick, rarityColor, typeLabel }) => {
	const classes = useStyles();
	const imgSrc = `nui://vertex-inventory/ui/images/items/${item.name}.webp`;

	return (
		<div className={classes.card} onClick={onClick}>
			<div className={classes.imageContainer}>
				<img
					className={classes.image}
					src={imgSrc}
					alt={item.label}
					onError={(e) => {
						e.target.style.display = 'none';
						e.target.nextSibling && (e.target.nextSibling.style.display = 'flex');
					}}
				/>
				<div className={classes.placeholder} style={{ display: 'none', position: 'absolute' }}>
					<FontAwesomeIcon icon={['fas', 'cube']} />
				</div>
			</div>
			<div className={classes.label} title={item.label}>{item.label}</div>
			<div className={classes.name} title={item.name}>{item.name}</div>
			<div className={classes.badges}>
				<span className={`${classes.badge} ${classes.typeBadge}`}>
					{typeLabel}
				</span>
				<span
					className={classes.badge}
					style={{
						background: `${rarityColor}18`,
						color: rarityColor,
						border: `1px solid ${rarityColor}40`,
					}}
				>
					R{item.rarity}
				</span>
			</div>
		</div>
	);
};
