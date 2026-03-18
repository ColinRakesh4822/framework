import React, { useEffect, useState } from 'react';
import {
	Grid,
	TextField,
	InputAdornment,
	IconButton,
	Pagination,
	MenuItem,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation } from 'react-router-dom';

import Nui from '../../util/Nui';
import { Loader } from '../../components';
import { inputSx } from '../../styles/theme';

import ItemCard from './ItemCard';
import ItemModal from './ItemModal';

const ITEM_TYPES = {
	0: 'All',
	1: 'Consumable',
	2: 'Weapon',
	3: 'Tool',
	4: 'Crafting',
	5: 'Collectible',
	6: 'Junk',
	7: 'Unknown',
	8: 'Evidence',
	9: 'Ammo',
	10: 'Container',
	11: 'Gem',
	12: 'Paraphernalia',
	13: 'Wearable',
	14: 'Contraband',
	15: 'Gang Chain',
	16: 'Attachment',
	17: 'Schematic',
};

const RARITY_COLORS = {
	0: '#8e8e8e',
	1: '#8e8e8e',
	2: '#52984a',
	3: '#4a7fb5',
	4: '#9f5cd6',
	5: '#f09348',
};

const PER_PAGE = 24;

const useStyles = makeStyles((theme) => ({
	wrapper: {
		padding: '20px 10px 20px 20px',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
	},
	targetBanner: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: '8px 12px',
		marginBottom: 12,
		background: 'rgba(32,134,146,0.08)',
		border: '1px solid rgba(32,134,146,0.2)',
		borderRadius: 2,
	},
	targetText: {
		fontFamily: "'Rajdhani', sans-serif",
		fontSize: 12,
		fontWeight: 600,
		color: '#208692',
		letterSpacing: '0.05em',
	},
	clearTargetBtn: {
		background: 'none',
		border: '1px solid rgba(32,134,146,0.3)',
		borderRadius: 2,
		color: 'rgba(32,134,146,0.7)',
		fontSize: 10,
		fontWeight: 700,
		fontFamily: "'Rajdhani', sans-serif",
		letterSpacing: '0.1em',
		textTransform: 'uppercase',
		padding: '3px 10px',
		cursor: 'pointer',
		transition: 'all 0.2s ease',
		'&:hover': {
			borderColor: '#208692',
			color: '#208692',
		},
	},
	search: {
		marginBottom: 12,
		flexShrink: 0,
	},
	results: {
		flex: 1,
		overflowY: 'auto',
		overflowX: 'hidden',
		minHeight: 0,
	},
	gridContainer: {
		display: 'grid',
		gridTemplateColumns: 'repeat(4, 1fr)',
		gap: 10,
		padding: '4px 4px 12px',
	},
	paginationWrapper: {
		display: 'flex',
		justifyContent: 'center',
		padding: '12px 0 4px',
		flexShrink: 0,
	},
	emptyState: {
		textAlign: 'center',
		padding: '40px 0',
		color: 'rgba(255, 255, 255, 0.3)',
	},
	emptyIcon: {
		fontSize: 32,
		marginBottom: 12,
		color: theme.palette.primary.main + '4D',
	},
	emptyText: {
		fontSize: 14,
		fontWeight: 500,
	},
	countLabel: {
		fontSize: 11,
		color: 'rgba(255, 255, 255, 0.3)',
		padding: '0 4px 8px',
	},
}));

export default () => {
	const classes = useStyles();
	const location = useLocation();

	const [searched, setSearched] = useState('');
	const [typeFilter, setTypeFilter] = useState(0);
	const [allItems, setAllItems] = useState([]);
	const [filtered, setFiltered] = useState([]);
	const [loading, setLoading] = useState(false);
	const [pages, setPages] = useState(1);
	const [page, setPage] = useState(1);

	const [selectedItem, setSelectedItem] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);

	const params = new URLSearchParams(location.search);
	const [targetSid, setTargetSid] = useState(params.get('sid') || '');
	const [targetName, setTargetName] = useState(params.get('name') || '');

	useEffect(() => {
		fetchItems();
	}, []);

	useEffect(() => {
		const results = allItems.filter((item) => {
			const s = searched.toLowerCase();
			const matchesSearch =
				s === '' ||
				item.name.toLowerCase().includes(s) ||
				item.label.toLowerCase().includes(s);
			const matchesType = typeFilter === 0 || item.type === typeFilter;
			return matchesSearch && matchesType;
		});
		setFiltered(results);
		setPages(Math.ceil(results.length / PER_PAGE));
		setPage(1);
	}, [allItems, searched, typeFilter]);

	const fetchItems = async () => {
		setLoading(true);
		try {
			let res = await (await Nui.send('GetItemList')).json();
			if (res && Array.isArray(res)) {
				setAllItems(res.sort((a, b) => a.label.localeCompare(b.label)));
			}
		} catch (e) {
			console.error('Failed to fetch items', e);
		}
		setLoading(false);
	};

	const onClear = () => setSearched('');

	const onCardClick = (item) => {
		setSelectedItem(item);
		setModalOpen(true);
	};

	const onCloseModal = () => {
		setModalOpen(false);
		setSelectedItem(null);
	};

	const onPagi = (e, p) => setPage(p);

	return (
		<div className={classes.wrapper}>
			{targetSid && (
				<div className={classes.targetBanner}>
					<span className={classes.targetText}>
						<FontAwesomeIcon icon={['fas', 'crosshairs']} style={{ marginRight: 6 }} />
						Giving items to: {targetName || `SID ${targetSid}`}
					</span>
					<button className={classes.clearTargetBtn} onClick={() => { setTargetSid(''); setTargetName(''); }}>
						Clear Target
					</button>
				</div>
			)}
			<div className={classes.search}>
				<Grid container spacing={1}>
					<Grid item xs={3}>
						<TextField
							select
							fullWidth
							label="Type"
							variant="outlined"
							size="small"
							value={typeFilter}
							onChange={(e) => setTypeFilter(parseInt(e.target.value))}
							sx={inputSx}
						>
							{Object.entries(ITEM_TYPES).map(([key, label]) => (
								<MenuItem key={key} value={parseInt(key)}>
									{label}
								</MenuItem>
							))}
						</TextField>
					</Grid>
					<Grid item xs={9}>
						<TextField
							fullWidth
							variant="outlined"
							size="small"
							value={searched}
							onChange={(e) => setSearched(e.target.value)}
							label="Search items by name or label..."
							sx={inputSx}
							InputProps={{
								endAdornment: searched !== '' && (
									<InputAdornment position="end">
										<IconButton size="small" onClick={onClear}>
											<FontAwesomeIcon icon={['fas', 'xmark']} style={{ fontSize: 12 }} />
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
					</Grid>
				</Grid>
			</div>
			<div className={classes.results}>
				{loading ? (
					<Loader text="Loading Items" />
				) : filtered.length === 0 ? (
					<div className={classes.emptyState}>
						<div className={classes.emptyIcon}>
							<FontAwesomeIcon icon={['fas', 'box-open']} />
						</div>
						<div className={classes.emptyText}>No items found</div>
					</div>
				) : (
					<>
						<div className={classes.countLabel}>
							{filtered.length} item{filtered.length !== 1 ? 's' : ''} found
						</div>
						<div className={classes.gridContainer}>
							{filtered
								.slice((page - 1) * PER_PAGE, page * PER_PAGE)
								.map((item) => (
									<ItemCard
										key={item.name}
										item={item}
										onClick={() => onCardClick(item)}
										rarityColor={RARITY_COLORS[item.rarity] || RARITY_COLORS[0]}
										typeLabel={ITEM_TYPES[item.type] || 'Unknown'}
									/>
								))}
						</div>
					</>
				)}
			</div>
			{pages > 1 && (
				<div className={classes.paginationWrapper}>
					<Pagination
						variant="outlined"
						shape="rounded"
						color="primary"
						page={page}
						count={pages}
						onChange={onPagi}
					/>
				</div>
			)}

			<ItemModal
				open={modalOpen}
				item={selectedItem}
				onClose={onCloseModal}
				targetSid={targetSid}
				targetName={targetName}
			/>
		</div>
	);
};
