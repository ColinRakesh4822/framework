import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
	Grid,
	TextField,
	InputAdornment,
	IconButton,
	MenuItem,
	Pagination,
	Dialog,
	DialogContent,
	DialogActions,
	Divider,
	Switch,
	FormControlLabel,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';

import Nui from '../../util/Nui';
import { Loader } from '../../components';
import { inputSx } from '../../styles/theme';

const PER_PAGE = 20;

const useStyles = makeStyles((theme) => ({
	wrapper: {
		padding: '20px 10px 20px 20px',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		fontFamily: "'Rajdhani', sans-serif",
	},
	header: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16,
		flexShrink: 0,
	},
	title: {
		fontFamily: "'Orbitron', sans-serif",
		fontSize: 16,
		fontWeight: 700,
		color: '#fff',
		letterSpacing: '0.1em',
	},
	subtitle: {
		fontSize: 11,
		color: 'rgba(255,255,255,0.35)',
		fontFamily: "'Rajdhani', sans-serif",
		fontWeight: 600,
		marginTop: 2,
	},
	headerBtns: {
		display: 'flex',
		gap: 8,
	},
	headerBtn: {
		fontFamily: "'Rajdhani', sans-serif",
		fontSize: 11,
		fontWeight: 700,
		letterSpacing: '0.1em',
		textTransform: 'uppercase',
		background: 'rgba(32,134,146,0.12)',
		border: '1px solid rgba(32,134,146,0.35)',
		borderRadius: 2,
		color: '#208692',
		padding: '6px 14px',
		cursor: 'pointer',
		transition: 'all 0.2s ease',
		display: 'flex',
		alignItems: 'center',
		gap: 6,
		'&:hover': {
			background: 'rgba(32,134,146,0.25)',
			borderColor: '#208692',
			boxShadow: '0 0 12px rgba(32,134,146,0.25)',
		},
	},
	search: {
		marginBottom: 12,
		flexShrink: 0,
	},
	tableWrap: {
		flex: 1,
		overflowY: 'auto',
		overflowX: 'hidden',
		minHeight: 0,
		'&::-webkit-scrollbar': { width: 4 },
		'&::-webkit-scrollbar-thumb': { background: 'rgba(32,134,146,0.3)', borderRadius: 2 },
		'&::-webkit-scrollbar-thumb:hover': { background: '#208692' },
		'&::-webkit-scrollbar-track': { background: 'transparent' },
	},
	table: {
		width: '100%',
		borderCollapse: 'collapse',
		fontFamily: "'Rajdhani', sans-serif",
	},
	th: {
		position: 'sticky',
		top: 0,
		background: '#0a0914',
		fontSize: 9,
		fontWeight: 700,
		letterSpacing: '0.2em',
		textTransform: 'uppercase',
		color: 'rgba(32,134,146,0.5)',
		padding: '8px 10px',
		textAlign: 'left',
		borderBottom: '1px solid rgba(32,134,146,0.15)',
		zIndex: 1,
	},
	tr: {
		cursor: 'pointer',
		transition: 'background 0.15s ease',
		'&:hover': {
			background: 'rgba(32,134,146,0.05)',
		},
	},
	td: {
		padding: '8px 10px',
		fontSize: 13,
		fontWeight: 600,
		color: 'rgba(255,255,255,0.8)',
		borderBottom: '1px solid rgba(32,134,146,0.06)',
		verticalAlign: 'top',
	},
	tdId: {
		fontWeight: 700,
		color: '#fff',
	},
	tdSub: {
		fontSize: 10,
		color: 'rgba(255,255,255,0.3)',
		marginTop: 1,
	},
	chip: {
		fontSize: 9,
		fontWeight: 700,
		fontFamily: "'Rajdhani', sans-serif",
		letterSpacing: '0.08em',
		textTransform: 'uppercase',
		padding: '2px 8px',
		borderRadius: 2,
		display: 'inline-block',
		marginRight: 4,
		marginBottom: 2,
	},
	chipEnabled: {
		background: 'rgba(32,134,146,0.15)',
		color: '#208692',
		border: '1px solid rgba(32,134,146,0.3)',
	},
	chipDisabled: {
		background: 'rgba(255,255,255,0.03)',
		color: 'rgba(255,255,255,0.3)',
		border: '1px solid rgba(255,255,255,0.06)',
	},
	chipSpawned: {
		background: 'rgba(82,152,74,0.15)',
		color: '#52984a',
		border: '1px solid rgba(82,152,74,0.3)',
	},
	chipNotSpawned: {
		background: 'rgba(255,255,255,0.03)',
		color: 'rgba(255,255,255,0.3)',
		border: '1px solid rgba(255,255,255,0.06)',
	},
	pager: {
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
		color: 'rgba(32,134,146,0.3)',
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
	// Dialog styles
	dialog: {
		'& .MuiDialog-paper': {
			background: '#121025',
			border: '1px solid rgba(32,134,146,0.25)',
			boxShadow: '0 0 0 1px rgba(32,134,146,0.06), 0 24px 80px rgba(0,0,0,0.7)',
			borderRadius: 2,
			color: '#fff',
			maxHeight: '85vh',
		},
		'& .MuiBackdrop-root': {
			backgroundColor: 'rgba(0,0,0,0.5)',
		},
	},
	dialogTitle: {
		fontFamily: "'Orbitron', sans-serif",
		fontSize: 14,
		fontWeight: 700,
		letterSpacing: '0.1em',
		color: '#fff',
		padding: '16px 24px',
	},
	dialogTitleBar: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '12px 24px',
	},
	dialogSubtext: {
		fontSize: 11,
		color: 'rgba(255,255,255,0.35)',
		fontFamily: "'Rajdhani', sans-serif",
		marginTop: 2,
	},
	sectionLabel: {
		fontSize: 9,
		fontWeight: 700,
		fontFamily: "'Rajdhani', sans-serif",
		letterSpacing: '0.3em',
		color: 'rgba(32,134,146,0.5)',
		textTransform: 'uppercase',
		marginBottom: 8,
		marginTop: 16,
	},
	actionBar: {
		display: 'flex',
		flexWrap: 'wrap',
		gap: 6,
		marginBottom: 12,
	},
	actionBtn: {
		fontFamily: "'Rajdhani', sans-serif",
		fontSize: 11,
		fontWeight: 700,
		letterSpacing: '0.1em',
		textTransform: 'uppercase',
		background: 'rgba(32,134,146,0.12)',
		border: '1px solid rgba(32,134,146,0.35)',
		borderRadius: 2,
		color: '#208692',
		padding: '5px 12px',
		cursor: 'pointer',
		transition: 'all 0.2s ease',
		display: 'flex',
		alignItems: 'center',
		gap: 5,
		'&:hover': {
			background: 'rgba(32,134,146,0.25)',
			borderColor: '#208692',
			boxShadow: '0 0 12px rgba(32,134,146,0.25)',
		},
		'&:disabled': {
			opacity: 0.3,
			cursor: 'not-allowed',
		},
	},
	formPanel: {
		background: 'rgba(18, 16, 37, 0.96)',
		border: '1px solid rgba(32,134,146,0.15)',
		borderRadius: 2,
		padding: 16,
	},
	optionCard: {
		background: 'rgba(18, 16, 37, 0.96)',
		border: '1px solid rgba(32,134,146,0.15)',
		borderRadius: 2,
		padding: 12,
		marginBottom: 10,
	},
	optionHeader: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	optionTitle: {
		fontFamily: "'Rajdhani', sans-serif",
		fontSize: 12,
		fontWeight: 700,
		color: '#208692',
	},
	removeBtn: {
		fontFamily: "'Rajdhani', sans-serif",
		fontSize: 10,
		fontWeight: 700,
		letterSpacing: '0.1em',
		textTransform: 'uppercase',
		background: 'rgba(240,68,68,0.1)',
		border: '1px solid rgba(240,68,68,0.3)',
		borderRadius: 2,
		color: '#f04444',
		padding: '3px 10px',
		cursor: 'pointer',
		transition: 'all 0.2s ease',
		'&:hover': {
			background: 'rgba(240,68,68,0.2)',
			borderColor: '#f04444',
		},
	},
	dialogFooter: {
		padding: '12px 24px',
		borderTop: '1px solid rgba(32,134,146,0.15)',
		background: 'rgba(10, 8, 28, 0.5)',
		display: 'flex',
		justifyContent: 'flex-end',
		gap: 8,
	},
	cancelBtn: {
		fontFamily: "'Rajdhani', sans-serif",
		fontSize: 12,
		fontWeight: 700,
		letterSpacing: '0.1em',
		textTransform: 'uppercase',
		background: 'transparent',
		border: '1px solid rgba(255,255,255,0.08)',
		borderRadius: 2,
		color: 'rgba(255,255,255,0.4)',
		padding: '6px 16px',
		cursor: 'pointer',
		'&:hover': {
			borderColor: 'rgba(255,255,255,0.2)',
			color: 'rgba(255,255,255,0.7)',
		},
	},
	saveBtn: {
		fontFamily: "'Rajdhani', sans-serif",
		fontSize: 12,
		fontWeight: 700,
		letterSpacing: '0.1em',
		textTransform: 'uppercase',
		background: 'rgba(32,134,146,0.15)',
		border: '1px solid rgba(32,134,146,0.5)',
		borderRadius: 2,
		color: '#208692',
		padding: '6px 16px',
		cursor: 'pointer',
		'&:hover': {
			background: 'rgba(32,134,146,0.28)',
			borderColor: '#208692',
			boxShadow: '0 0 16px rgba(32,134,146,0.3)',
		},
	},
	divider: {
		backgroundColor: 'rgba(32,134,146,0.15)',
	},
	jsonField: {
		'& textarea': {
			fontFamily: 'monospace',
			fontSize: 12,
		},
	},
	captureBtn: {
		display: 'inline-flex',
		alignItems: 'center',
		gap: 6,
		background: 'rgba(46,204,113,0.15)',
		border: '1px solid rgba(46,204,113,0.3)',
		color: '#2ecc71',
		fontSize: 11,
		fontFamily: "'Rajdhani', sans-serif",
		fontWeight: 600,
		padding: '6px 14px',
		borderRadius: 4,
		cursor: 'pointer',
		transition: 'all 0.2s ease',
		'&:hover': {
			background: 'rgba(46,204,113,0.25)',
			borderColor: '#2ecc71',
			boxShadow: '0 0 12px rgba(46,204,113,0.2)',
		},
	},
	noteText: {
		fontSize: 10,
		color: 'rgba(255,255,255,0.25)',
		fontFamily: "'Rajdhani', sans-serif",
		marginTop: 4,
	},
}));

const deepClone = (x) => JSON.parse(JSON.stringify(x ?? null));

const formatCoords = (c) =>
	c?.x != null ? `${Number(c.x).toFixed(2)}, ${Number(c.y).toFixed(2)}, ${Number(c.z).toFixed(2)}` : 'N/A';

const normalizeMenu = (menuArr) =>
	(menuArr || []).map((o) => ({
		icon: o.icon || '',
		text: o.text || '',
		event: o.event || '',
		minDist: o.minDist ?? 2.0,
		jobs: o.jobs ?? false,
		data: o.data ?? {},
	}));

const buildLuaAddCode = (def) => {
	const id = def.id || 'ped_id';
	const modelRaw = (def.modelRaw || '').trim();
	const modelHash = def.model;
	const modelExpr = modelRaw ? `\`${modelRaw}\`` : `GetHashKey("${String(modelHash || 0)}")`;
	const c = def.coords || { x: 0, y: 0, z: 0 };
	const heading = Number(def.heading) || 0;
	const range = Number(def.range) || 25.0;
	const icon = (def.icon || '').trim();
	const scenario = (def.scenario || '').trim();

	let anim = def.anim || null;
	let animPart = '';
	if (!scenario) {
		const ad = (anim?.animDict || '').trim();
		const an = (anim?.anim || '').trim();
		if (ad && an) {
			animPart = `,\n\tfalse,\n\ttrue,\n\t{\n\t\tanimDict = "${ad}",\n\t\tanim = "${an}",\n\t\tflag = ${Number(anim.flag) || 1},\n\t}\n`;
		}
	}

	const menu = normalizeMenu(def.menu);

	const toLua = (v, indent = 0) => {
		const pad = '\t'.repeat(indent);
		if (v === null || v === undefined) return 'nil';
		if (typeof v === 'number') return String(v);
		if (typeof v === 'boolean') return v ? 'true' : 'false';
		if (typeof v === 'string') return `"${v.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
		if (Array.isArray(v)) {
			if (v.length === 0) return '{}';
			return `{\n${v.map((x) => `${pad}\t${toLua(x, indent + 1)},`).join('\n')}\n${pad}}`;
		}
		if (typeof v === 'object') {
			const keys = Object.keys(v);
			if (keys.length === 0) return '{}';
			return `{\n${keys.map((k) => `${pad}\t${k} = ${toLua(v[k], indent + 1)},`).join('\n')}\n${pad}}`;
		}
		return 'nil';
	};

	const menuLua = toLua(
		menu.map((m) => ({
			icon: m.icon,
			text: m.text,
			event: m.event,
			data: m.data || {},
			minDist: m.minDist ?? 2.0,
			jobs: m.jobs ?? false,
		})),
		1
	);

	if (scenario) {
		return `PedInteraction:Add(\n\t"${id}",\n\t${modelExpr},\n\tvector3(${c.x}, ${c.y}, ${c.z}),\n\t${heading},\n\t${range},\n\t${menuLua},\n\t"${icon || 'person-sign'}",\n\t"${scenario}"\n)`;
	}
	if (animPart) {
		return `PedInteraction:Add(\n\t"${id}",\n\t${modelExpr},\n\tvector3(${c.x}, ${c.y}, ${c.z}),\n\t${heading},\n\t${range},\n\t${menuLua},\n\t"${icon || 'person-sign'}"${animPart})`;
	}
	return `PedInteraction:Add(\n\t"${id}",\n\t${modelExpr},\n\tvector3(${c.x}, ${c.y}, ${c.z}),\n\t${heading},\n\t${range},\n\t${menuLua},\n\t"${icon || 'person-sign'}"\n)`;
};

const EMPTY_CREATE = {
	id: '',
	modelRaw: '',
	coords: { x: 0, y: 0, z: 0 },
	heading: 0,
	range: 25,
	icon: 'person-sign',
	enabled: true,
	force: true,
	scenario: '',
	anim: { animDict: '', anim: '', flag: 1 },
	componentJson: '',
	menu: [{ icon: 'circle-question', text: 'Test Option', event: 'Test:Client:Option', data: {}, minDist: 2.0, jobs: false }],
};

// Menu option editor component
const MenuOptionEditor = ({ which, menu, onUpdate, onRemove, onAdd, classes }) => (
	<div>
		<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
			<div className={classes.sectionLabel} style={{ margin: 0 }}>Menu Options</div>
			<button className={classes.actionBtn} onClick={onAdd}>
				<FontAwesomeIcon icon={['fas', 'plus']} /> Add Option
			</button>
		</div>
		{!(menu || []).length ? (
			<div className={classes.noteText}>No menu options.</div>
		) : (
			menu.map((opt, idx) => (
				<div key={idx} className={classes.optionCard}>
					<div className={classes.optionHeader}>
						<span className={classes.optionTitle}>Option #{idx + 1}</span>
						<div style={{ display: 'flex', gap: 6 }}>
							<button className={classes.actionBtn} onClick={() => Nui.copyClipboard(opt.event || '')} disabled={!opt.event}>
								<FontAwesomeIcon icon={['fas', 'copy']} /> Copy Event
							</button>
							<button className={classes.removeBtn} onClick={() => onRemove(idx)}>
								<FontAwesomeIcon icon={['fas', 'trash']} /> Remove
							</button>
						</div>
					</div>
					<Grid container spacing={1}>
						<Grid item xs={3}>
							<TextField label="Icon" variant="outlined" size="small" fullWidth value={opt.icon || ''} onChange={(e) => onUpdate(idx, { icon: e.target.value })} sx={inputSx} />
						</Grid>
						<Grid item xs={3}>
							<TextField label="Text" variant="outlined" size="small" fullWidth value={opt.text || ''} onChange={(e) => onUpdate(idx, { text: e.target.value })} sx={inputSx} />
						</Grid>
						<Grid item xs={4}>
							<TextField label="Event" variant="outlined" size="small" fullWidth value={opt.event || ''} onChange={(e) => onUpdate(idx, { event: e.target.value })} sx={inputSx} />
						</Grid>
						<Grid item xs={2}>
							<TextField label="Min Dist" variant="outlined" size="small" fullWidth value={opt.minDist ?? 2.0} onChange={(e) => onUpdate(idx, { minDist: Number(e.target.value) || 0 })} sx={inputSx} />
						</Grid>
						<Grid item xs={12}>
							<TextField
								label="Jobs (comma list, empty = all)"
								variant="outlined"
								size="small"
								fullWidth
								value={opt.jobs === false || opt.jobs == null ? '' : Array.isArray(opt.jobs) ? opt.jobs.join(', ') : String(opt.jobs)}
								onChange={(e) => {
									const v = e.target.value.trim();
									if (!v) return onUpdate(idx, { jobs: false });
									const arr = v.split(',').map((x) => x.trim()).filter(Boolean);
									onUpdate(idx, { jobs: arr.length ? arr : false });
								}}
								sx={inputSx}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								label="Data JSON"
								variant="outlined"
								size="small"
								fullWidth
								multiline
								minRows={2}
								value={typeof opt.data === 'string' ? opt.data : JSON.stringify(opt.data || {}, null, 2)}
								onChange={(e) => onUpdate(idx, { data: e.target.value })}
								sx={{ ...inputSx, '& textarea': { fontFamily: 'monospace', fontSize: 12 } }}
							/>
						</Grid>
					</Grid>
				</div>
			))
		)}
	</div>
);

export default () => {
	const classes = useStyles();

	const [snapshot, setSnapshot] = useState({ total: 0, spawned: 0, peds: [] });
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState('');
	const [spawnedFilter, setSpawnedFilter] = useState('all');
	const [enabledFilter, setEnabledFilter] = useState('all');
	const [page, setPage] = useState(1);

	// Edit dialog
	const [editOpen, setEditOpen] = useState(false);
	const [selectedPed, setSelectedPed] = useState(null);
	const [editPed, setEditPed] = useState(null);

	// Create dialog
	const [createOpen, setCreateOpen] = useState(false);
	const [createPed, setCreatePed] = useState({ ...EMPTY_CREATE });

	const fetchPeds = useCallback(async (showLoader = true) => {
		if (showLoader) setLoading(true);
		try {
			const res = await (await Nui.send('GetPedInteractionSnapshot', {})).json();
			if (res && res.peds) setSnapshot(res);
			else setSnapshot({ total: 0, spawned: 0, peds: [] });
		} catch {
			setSnapshot({ total: 0, spawned: 0, peds: [] });
		}
		if (showLoader) setLoading(false);
	}, []);

	useEffect(() => {
		fetchPeds(true);
		const interval = setInterval(() => fetchPeds(false), 10000);
		return () => clearInterval(interval);
	}, []);

	// Listen for ped placement helper capture
	useEffect(() => {
		const handler = (event) => {
			if (event.data && event.data.type === 'PED_POSITION_CAPTURED') {
				const d = event.data.data;
				if (d) {
					setCreatePed((prev) => ({
						...prev,
						coords: { x: d.x, y: d.y, z: d.z },
						heading: d.heading,
					}));
					setCreateOpen(true);
					toast.success('Position captured — coordinates updated');
				}
			}
		};
		window.addEventListener('message', handler);
		return () => window.removeEventListener('message', handler);
	}, []);

	const filteredPeds = useMemo(() => {
		let list = [...(snapshot.peds || [])];
		if (search) {
			const q = search.toLowerCase();
			list = list.filter((p) => {
				const id = `${p.id || ''}`.toLowerCase();
				const modelRaw = `${p.modelRaw || ''}`.toLowerCase();
				const model = `${p.model || ''}`.toLowerCase();
				const menuText = (p.menu || []).map((m) => `${m.text || ''} ${m.event || ''}`).join(' ').toLowerCase();
				return id.includes(q) || modelRaw.includes(q) || model.includes(q) || menuText.includes(q);
			});
		}
		if (spawnedFilter !== 'all') list = list.filter((p) => (spawnedFilter === 'spawned' ? !!p.spawned : !p.spawned));
		if (enabledFilter !== 'all') list = list.filter((p) => (enabledFilter === 'enabled' ? !!p.enabled : !p.enabled));
		return list;
	}, [snapshot, search, spawnedFilter, enabledFilter]);

	const totalPages = Math.max(1, Math.ceil(filteredPeds.length / PER_PAGE));

	useEffect(() => { setPage(1); }, [filteredPeds.length]);

	const safeSendAction = async (cb, payload, successMsg) => {
		try {
			const res = await (await Nui.send(cb, payload)).json();
			if (res && res.success === false) {
				toast.error(res.message || 'Action failed');
				return false;
			}
			if (successMsg) toast.success(successMsg);
			await fetchPeds(false);
			return true;
		} catch {
			toast.error('Action error');
			return false;
		}
	};

	// Edit dialog
	const openEdit = (ped) => {
		setSelectedPed(ped);
		const e = deepClone(ped);
		e.coords = e.coords || { x: 0, y: 0, z: 0 };
		e.heading = e.heading ?? 0;
		e.range = e.range ?? 25;
		e.modelRaw = e.modelRaw || '';
		e.icon = e.icon || '';
		e.scenario = e.scenario || '';
		e.anim = e.anim || { animDict: '', anim: '', flag: 1 };
		e.menu = e.menu || [];
		e.force = !!e.force;
		e.componentJson = e.component ? JSON.stringify(e.component, null, 2) : '';
		setEditPed(e);
		setEditOpen(true);
	};

	const closeEdit = () => { setEditOpen(false); setSelectedPed(null); setEditPed(null); };

	const updateEditPed = (patch) => setEditPed((prev) => ({ ...prev, ...patch }));
	const updateEditCoords = (key, value) => {
		const n = Number(value);
		setEditPed((prev) => ({ ...prev, coords: { ...(prev.coords || { x: 0, y: 0, z: 0 }), [key]: Number.isFinite(n) ? n : 0 } }));
	};

	const buildPatch = () => {
		if (!editPed?.id) return null;
		let scenario = (editPed.scenario || '').trim();
		let anim = editPed.anim || null;
		const animDict = (anim?.animDict || '').trim();
		const animName = (anim?.anim || '').trim();
		if (scenario.length > 0) { anim = null; }
		else if (!animDict || !animName) { anim = null; }
		else { anim = { ...anim, animDict, anim: animName, flag: anim.flag ?? 1 }; }

		let component = null;
		const cj = (editPed.componentJson || '').trim();
		if (cj.length > 0) {
			try { component = JSON.parse(cj); }
			catch { return { error: 'Component JSON is invalid' }; }
		}

		const modelRaw = (editPed.modelRaw || '').trim();
		const coords = editPed.coords || { x: 0, y: 0, z: 0 };

		return {
			id: editPed.id,
			patch: {
				enabled: !!editPed.enabled,
				force: !!editPed.force,
				range: Number(editPed.range) || 25.0,
				heading: Number(editPed.heading) || 0.0,
				icon: (editPed.icon || '').trim() || null,
				coords: { x: Number(coords.x) || 0, y: Number(coords.y) || 0, z: Number(coords.z) || 0 },
				modelRaw: modelRaw || null,
				model: modelRaw || editPed.model,
				scenario: scenario || null,
				anim: anim || null,
				component,
				menu: normalizeMenu(editPed.menu),
			},
		};
	};

	const applyEdit = async () => {
		const payload = buildPatch();
		if (!payload) return;
		if (payload.error) return toast.error(payload.error);
		await safeSendAction('PedMgmt_Update', payload, `Updated ${payload.id}`);
	};

	const updateEditOption = (idx, patch) => {
		setEditPed((prev) => {
			const menu = [...(prev.menu || [])];
			menu[idx] = { ...(menu[idx] || {}), ...patch };
			return { ...prev, menu };
		});
	};

	const removeEditOption = (idx) => {
		setEditPed((prev) => {
			const menu = [...(prev.menu || [])];
			menu.splice(idx, 1);
			return { ...prev, menu };
		});
	};

	const addEditOption = () => {
		setEditPed((prev) => ({
			...prev,
			menu: [...(prev.menu || []), { icon: 'circle-question', text: 'New Option', event: '', data: {}, minDist: 2.0, jobs: false }],
		}));
	};

	// Create dialog
	const openCreate = () => {
		setCreatePed({ ...EMPTY_CREATE, id: `temp_ped_${Date.now()}` });
		setCreateOpen(true);
	};

	const closeCreate = () => setCreateOpen(false);

	const updateCreatePed = (patch) => setCreatePed((prev) => ({ ...prev, ...patch }));
	const updateCreateCoords = (key, value) => {
		const n = Number(value);
		setCreatePed((prev) => ({ ...prev, coords: { ...(prev.coords || { x: 0, y: 0, z: 0 }), [key]: Number.isFinite(n) ? n : 0 } }));
	};

	const updateCreateOption = (idx, patch) => {
		setCreatePed((prev) => {
			const menu = [...(prev.menu || [])];
			menu[idx] = { ...(menu[idx] || {}), ...patch };
			return { ...prev, menu };
		});
	};

	const removeCreateOption = (idx) => {
		setCreatePed((prev) => {
			const menu = [...(prev.menu || [])];
			menu.splice(idx, 1);
			return { ...prev, menu };
		});
	};

	const addCreateOption = () => {
		setCreatePed((prev) => ({
			...prev,
			menu: [...(prev.menu || []), { icon: 'circle-question', text: 'New Option', event: '', data: {}, minDist: 2.0, jobs: false }],
		}));
	};

	const createTempPed = async () => {
		const id = (createPed.id || '').trim();
		if (!id) return toast.error('Missing ID');
		const modelRaw = (createPed.modelRaw || '').trim();
		if (!modelRaw) return toast.error('Missing model');

		let component = null;
		const cj = (createPed.componentJson || '').trim();
		if (cj) {
			try { component = JSON.parse(cj); }
			catch { return toast.error('Component JSON is invalid'); }
		}

		const scenario = (createPed.scenario || '').trim();
		const animDict = (createPed.anim?.animDict || '').trim();
		const animName = (createPed.anim?.anim || '').trim();
		const anim = scenario.length > 0 ? null : (animDict && animName) ? { animDict, anim: animName, flag: Number(createPed.anim?.flag) || 1 } : null;

		const def = {
			id,
			model: modelRaw,
			coords: { x: Number(createPed.coords?.x) || 0, y: Number(createPed.coords?.y) || 0, z: Number(createPed.coords?.z) || 0 },
			heading: Number(createPed.heading) || 0,
			range: Number(createPed.range) || 25.0,
			icon: (createPed.icon || '').trim() || 'person-sign',
			enabled: !!createPed.enabled,
			force: !!createPed.force,
			scenario: scenario || null,
			anim,
			component,
			menu: normalizeMenu(createPed.menu),
		};

		const ok = await safeSendAction('PedMgmt_CreateTemp', { tempId: id, def }, `Created temp ped ${id}`);
		if (ok) setCreateOpen(false);
	};

	// Ped form fields (shared between edit and create)
	const renderPedForm = (ped, updatePed, updateCoords, isCreate) => (
		<div className={classes.formPanel}>
			<Grid container spacing={1}>
				{isCreate && (
					<Grid item xs={12} md={6}>
						<TextField label="ID" variant="outlined" size="small" fullWidth value={ped.id || ''} onChange={(e) => updatePed({ id: e.target.value })} sx={inputSx} />
					</Grid>
				)}
				<Grid item xs={12} md={isCreate ? 6 : 6}>
					<TextField label="Model (string)" variant="outlined" size="small" fullWidth value={ped.modelRaw || ''} onChange={(e) => updatePed({ modelRaw: e.target.value })} placeholder="e.g. s_m_m_doctor_01" sx={inputSx} />
				</Grid>
				<Grid item xs={6} md={3}>
					<TextField label="Range" variant="outlined" size="small" fullWidth value={ped.range ?? 25} onChange={(e) => updatePed({ range: e.target.value })} sx={inputSx} />
				</Grid>
				<Grid item xs={6} md={3}>
					<TextField label="Heading" variant="outlined" size="small" fullWidth value={ped.heading ?? 0} onChange={(e) => updatePed({ heading: e.target.value })} sx={inputSx} />
				</Grid>
				{isCreate && (
					<Grid item xs={12}>
						<button
							className={classes.captureBtn}
							onClick={async () => {
								setCreateOpen(false);
								try { await Nui.send('StartPedPlacementHelper'); } catch (e) {}
							}}
						>
							<FontAwesomeIcon icon={['fas', 'crosshairs']} /> Pick Location In-Game
						</button>
					</Grid>
				)}
				<Grid item xs={4}>
					<TextField label="X" variant="outlined" size="small" fullWidth value={ped.coords?.x ?? 0} onChange={(e) => updateCoords('x', e.target.value)} sx={inputSx} />
				</Grid>
				<Grid item xs={4}>
					<TextField label="Y" variant="outlined" size="small" fullWidth value={ped.coords?.y ?? 0} onChange={(e) => updateCoords('y', e.target.value)} sx={inputSx} />
				</Grid>
				<Grid item xs={4}>
					<TextField label="Z" variant="outlined" size="small" fullWidth value={ped.coords?.z ?? 0} onChange={(e) => updateCoords('z', e.target.value)} sx={inputSx} />
				</Grid>
				<Grid item xs={12} md={6}>
					<TextField label="Icon" variant="outlined" size="small" fullWidth value={ped.icon || ''} onChange={(e) => updatePed({ icon: e.target.value })} placeholder="person-sign" sx={inputSx} />
				</Grid>
				<Grid item xs={6} md={3}>
					<FormControlLabel
						control={<Switch checked={!!ped.enabled} onChange={(e) => updatePed({ enabled: e.target.checked })} color="primary" />}
						label={<span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 13, fontWeight: 600 }}>Enabled</span>}
					/>
				</Grid>
				<Grid item xs={6} md={3}>
					<FormControlLabel
						control={<Switch checked={!!ped.force} onChange={(e) => updatePed({ force: e.target.checked })} color="primary" />}
						label={<span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 13, fontWeight: 600 }}>Force Spawn</span>}
					/>
				</Grid>
				<Grid item xs={12}><Divider className={classes.divider} /></Grid>
				<Grid item xs={12} md={6}>
					<TextField label="Scenario" variant="outlined" size="small" fullWidth value={ped.scenario || ''} onChange={(e) => updatePed({ scenario: e.target.value })} placeholder="WORLD_HUMAN_CLIPBOARD" sx={inputSx} />
					<div className={classes.noteText}>If scenario is set, anim will be ignored.</div>
				</Grid>
				<Grid item xs={6} md={3}>
					<TextField label="Anim Dict" variant="outlined" size="small" fullWidth value={ped.anim?.animDict || ''} onChange={(e) => updatePed({ anim: { ...(ped.anim || {}), animDict: e.target.value } })} sx={inputSx} />
				</Grid>
				<Grid item xs={6} md={3}>
					<TextField label="Anim Name" variant="outlined" size="small" fullWidth value={ped.anim?.anim || ''} onChange={(e) => updatePed({ anim: { ...(ped.anim || {}), anim: e.target.value } })} sx={inputSx} />
				</Grid>
				<Grid item xs={12}>
					<TextField
						label="Component JSON (optional)"
						variant="outlined"
						size="small"
						fullWidth
						multiline
						minRows={3}
						value={ped.componentJson || ''}
						onChange={(e) => updatePed({ componentJson: e.target.value })}
						placeholder='{"componentId":0,"drawableId":0,"textureId":0,"paletteId":0}'
						sx={{ ...inputSx, '& textarea': { fontFamily: 'monospace', fontSize: 12 } }}
					/>
				</Grid>
			</Grid>
		</div>
	);

	return (
		<div className={classes.wrapper}>
			<div className={classes.header}>
				<div>
					<div className={classes.title}>Ped Management</div>
					<div className={classes.subtitle}>
						Total: {snapshot.total || 0} &bull; Nearby: {snapshot.spawned || 0} &bull; Client-side only
					</div>
				</div>
				<div className={classes.headerBtns}>
					<button className={classes.headerBtn} onClick={openCreate}>
						<FontAwesomeIcon icon={['fas', 'plus']} /> Create Temp
					</button>
					<button className={classes.headerBtn} onClick={() => fetchPeds()}>
						<FontAwesomeIcon icon={['fas', 'arrows-rotate']} /> Refresh
					</button>
				</div>
			</div>

			<div className={classes.search}>
				<Grid container spacing={1}>
					<Grid item xs={6}>
						<TextField
							fullWidth
							variant="outlined"
							size="small"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							label="Search by ID, model, or menu text..."
							sx={inputSx}
							InputProps={{
								endAdornment: search && (
									<InputAdornment position="end">
										<IconButton size="small" onClick={() => setSearch('')}>
											<FontAwesomeIcon icon={['fas', 'xmark']} style={{ fontSize: 12 }} />
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
					</Grid>
					<Grid item xs={3}>
						<TextField select fullWidth label="Spawned" variant="outlined" size="small" value={spawnedFilter} onChange={(e) => setSpawnedFilter(e.target.value)} sx={inputSx}>
							<MenuItem value="all">All</MenuItem>
							<MenuItem value="spawned">Nearby</MenuItem>
							<MenuItem value="not_spawned">Out of Range</MenuItem>
						</TextField>
					</Grid>
					<Grid item xs={3}>
						<TextField select fullWidth label="Enabled" variant="outlined" size="small" value={enabledFilter} onChange={(e) => setEnabledFilter(e.target.value)} sx={inputSx}>
							<MenuItem value="all">All</MenuItem>
							<MenuItem value="enabled">Enabled</MenuItem>
							<MenuItem value="disabled">Disabled</MenuItem>
						</TextField>
					</Grid>
				</Grid>
			</div>

			<div className={classes.tableWrap}>
				{loading ? (
					<Loader text="Loading Peds" />
				) : filteredPeds.length === 0 ? (
					<div className={classes.emptyState}>
						<div className={classes.emptyIcon}><FontAwesomeIcon icon={['fas', 'person']} /></div>
						<div className={classes.emptyText}>No peds found</div>
					</div>
				) : (
					<>
						<div className={classes.countLabel}>{filteredPeds.length} ped{filteredPeds.length !== 1 ? 's' : ''} found</div>
						<table className={classes.table}>
							<thead>
								<tr>
									<th className={classes.th} style={{ width: '25%' }}>ID</th>
									<th className={classes.th} style={{ width: '15%' }}>Status</th>
									<th className={classes.th} style={{ width: '20%' }}>Model</th>
									<th className={classes.th} style={{ width: '25%' }}>Coords</th>
									<th className={classes.th} style={{ width: '7%' }}>Menu</th>
									<th className={classes.th} style={{ width: '8%' }}>Meta</th>
								</tr>
							</thead>
							<tbody>
								{filteredPeds.slice((page - 1) * PER_PAGE, page * PER_PAGE).map((p) => (
									<tr key={p.id} className={classes.tr} onClick={() => openEdit(p)}>
										<td className={classes.td}>
											<div className={classes.tdId}>{p.id}</div>
											<div className={classes.tdSub}>Range: {p.range ?? 'N/A'} &bull; Heading: {Number(p.heading ?? 0).toFixed(1)}</div>
										</td>
										<td className={classes.td}>
											<span className={`${classes.chip} ${p.enabled ? classes.chipEnabled : classes.chipDisabled}`}>
												{p.enabled ? 'Enabled' : 'Disabled'}
											</span>
											<span className={`${classes.chip} ${p.spawned ? classes.chipSpawned : classes.chipNotSpawned}`}>
												{p.spawned ? 'Nearby' : 'Out of Range'}
											</span>
										</td>
										<td className={classes.td}>
											<div style={{ fontWeight: 700 }}>{p.modelRaw || p.model || 'N/A'}</div>
											<div className={classes.tdSub}>Icon: {p.icon || 'N/A'}</div>
										</td>
										<td className={classes.td}>
											<div>{formatCoords(p.coords)}</div>
											<div className={classes.tdSub}>Current: {p.currentCoords ? formatCoords(p.currentCoords) : 'N/A'}</div>
										</td>
										<td className={classes.td}>{(p.menu || []).length}</td>
										<td className={classes.td}>
											<span className={`${classes.chip} ${p.scenario ? classes.chipEnabled : classes.chipDisabled}`}>
												{p.scenario ? 'Scn' : 'No Scn'}
											</span>
											<span className={`${classes.chip} ${p.anim?.animDict ? classes.chipEnabled : classes.chipDisabled}`}>
												{p.anim?.animDict ? 'Anim' : 'No Anim'}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</>
				)}
			</div>

			{totalPages > 1 && (
				<div className={classes.pager}>
					<Pagination variant="outlined" shape="rounded" color="primary" page={page} count={totalPages} onChange={(e, v) => setPage(v)} />
				</div>
			)}

			{/* Edit Dialog */}
			<Dialog open={editOpen} onClose={closeEdit} maxWidth="md" fullWidth className={classes.dialog}>
				<div className={classes.dialogTitleBar}>
					<div>
						<div className={classes.dialogTitle}>Edit Ped &mdash; {selectedPed?.id || 'Ped'}</div>
						<div className={classes.dialogSubtext}>{selectedPed?.modelRaw || selectedPed?.model || 'N/A'} &bull; Menu: {(selectedPed?.menu || []).length}</div>
					</div>
					<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
						<button className={classes.actionBtn} onClick={() => { if (editPed) Nui.copyClipboard(buildLuaAddCode(editPed)); toast.success('Lua code copied'); }}>
							<FontAwesomeIcon icon={['fas', 'code']} /> Copy Add Code
						</button>
						<IconButton size="small" onClick={closeEdit} style={{ color: 'rgba(255,255,255,0.4)' }}>
							<FontAwesomeIcon icon={['fas', 'xmark']} />
						</IconButton>
					</div>
				</div>

				<Divider className={classes.divider} />

				<DialogContent style={{ padding: '16px 24px' }}>
					<div className={classes.sectionLabel} style={{ marginTop: 0 }}>Actions</div>
					<div className={classes.actionBar}>
						<button className={classes.actionBtn} onClick={() => { const c = selectedPed?.currentCoords || selectedPed?.coords; if (!c) return toast.error('No coords'); safeSendAction('PedMgmt_TeleportTo', { x: c.x, y: c.y, z: c.z }, `Teleported to ${selectedPed?.id}`); }} disabled={!selectedPed?.id}>
							<FontAwesomeIcon icon={['fas', 'location-crosshairs']} /> Teleport
						</button>
						<button className={classes.actionBtn} onClick={() => {
							const c = selectedPed?.coords || selectedPed?.currentCoords;
							if (!c) return toast.error('No coords');
							Nui.copyClipboard(`vector3(${Number(c.x).toFixed(3)}, ${Number(c.y).toFixed(3)}, ${Number(c.z).toFixed(3)})`);
							toast.success('Coords copied');
						}} disabled={!selectedPed}>
							<FontAwesomeIcon icon={['fas', 'copy']} /> Copy Coords
						</button>
						<button className={classes.actionBtn} onClick={() => safeSendAction('PedMgmt_Toggle', { id: selectedPed?.id, enabled: !selectedPed?.enabled }, `${selectedPed?.id} ${!selectedPed?.enabled ? 'enabled' : 'disabled'}`)} disabled={!selectedPed}>
							<FontAwesomeIcon icon={['fas', 'power-off']} /> {selectedPed?.enabled ? 'Disable' : 'Enable'}
						</button>
						{selectedPed?.spawned ? (
							<button className={classes.actionBtn} onClick={() => safeSendAction('PedMgmt_ForceDespawn', { id: selectedPed?.id }, `Despawned ${selectedPed?.id}`)} disabled={!selectedPed?.id}>
								<FontAwesomeIcon icon={['fas', 'person-circle-minus']} /> Despawn
							</button>
						) : (
							<button className={classes.actionBtn} onClick={() => safeSendAction('PedMgmt_ForceSpawn', { id: selectedPed?.id }, `Force spawned ${selectedPed?.id}`)} disabled={!selectedPed?.id}>
								<FontAwesomeIcon icon={['fas', 'person-circle-plus']} /> Spawn
							</button>
						)}
					</div>

					<div className={classes.sectionLabel}>Edit (Live)</div>
					{editPed && renderPedForm(editPed, updateEditPed, updateEditCoords, false)}

					<div style={{ marginTop: 16 }}>
						{editPed && (
							<MenuOptionEditor
								which="edit"
								menu={editPed.menu}
								onUpdate={updateEditOption}
								onRemove={removeEditOption}
								onAdd={addEditOption}
								classes={classes}
							/>
						)}
					</div>
				</DialogContent>

				<div className={classes.dialogFooter}>
					<button className={classes.cancelBtn} onClick={closeEdit}>Close</button>
					<button className={classes.saveBtn} onClick={applyEdit}>Apply Live</button>
				</div>
			</Dialog>

			{/* Create Dialog */}
			<Dialog open={createOpen} onClose={closeCreate} maxWidth="md" fullWidth className={classes.dialog}>
				<div className={classes.dialogTitleBar}>
					<div>
						<div className={classes.dialogTitle}>Create Temp Ped</div>
						<div className={classes.dialogSubtext}>Create a client-side ped for testing, then copy Add() code.</div>
					</div>
					<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
						<button className={classes.actionBtn} onClick={() => {
							const code = buildLuaAddCode({ ...createPed, model: createPed.modelRaw, component: createPed.componentJson ? (() => { try { return JSON.parse(createPed.componentJson); } catch { return null; } })() : null });
							Nui.copyClipboard(code);
							toast.success('Lua code copied');
						}}>
							<FontAwesomeIcon icon={['fas', 'code']} /> Copy Add Code
						</button>
						<IconButton size="small" onClick={closeCreate} style={{ color: 'rgba(255,255,255,0.4)' }}>
							<FontAwesomeIcon icon={['fas', 'xmark']} />
						</IconButton>
					</div>
				</div>

				<Divider className={classes.divider} />

				<DialogContent style={{ padding: '16px 24px' }}>
					{renderPedForm(createPed, updateCreatePed, updateCreateCoords, true)}

					<div style={{ marginTop: 16 }}>
						<MenuOptionEditor
							which="create"
							menu={createPed.menu}
							onUpdate={updateCreateOption}
							onRemove={removeCreateOption}
							onAdd={addCreateOption}
							classes={classes}
						/>
					</div>
				</DialogContent>

				<div className={classes.dialogFooter}>
					<button className={classes.cancelBtn} onClick={closeCreate}>Close</button>
					<button className={classes.saveBtn} onClick={createTempPed}>
						<FontAwesomeIcon icon={['fas', 'plus']} style={{ marginRight: 4 }} /> Create Temp Ped
					</button>
				</div>
			</Dialog>
		</div>
	);
};
