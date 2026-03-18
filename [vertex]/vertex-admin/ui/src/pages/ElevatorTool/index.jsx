import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
    TextField, InputAdornment,
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Switch, FormControlLabel, MenuItem, Select, FormControl, InputLabel,
    IconButton, Accordion, AccordionSummary, AccordionDetails,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';

import Nui from '../../util/Nui';
import { Loader } from '../../components';
import * as T from '../../styles/theme';

const useStyles = makeStyles((theme) => ({
    wrapper: T.wrapper,
    header: T.header,
    headerLeft: T.headerLeft,
    title: T.title,
    subtitle: T.subtitle,
    headerActions: T.headerActions,
    statsRow: T.statsRow,
    filterRow: T.filterRow,
    searchField: T.searchFieldSx,
    tableContainer: T.tableContainer,
    dialog: {
        '& .MuiDialog-paper': {
            background: T.bgMain, border: `1px solid ${T.borderTeal}`,
            borderRadius: 12, color: T.textPrimary, minWidth: 550, maxWidth: 650, maxHeight: '85vh',
        },
    },
    dialogTitle: T.dialogTitleDark,
    dialogContent: T.dialogContent,
    dialogActions: T.dialogActions,
    formField: T.formFieldSx,
    formRow: T.formRow,
    sectionLabel: T.sectionLabel,
    switchLabel: T.switchLabel,
    smallField: T.smallFieldSx,
    selectMenu: T.selectMenu,
    // Elevator-specific styles
    floorCard: {
        marginBottom: 8,
        background: T.whiteAlpha(0.03),
        border: `1px solid ${T.borderSubtle}`,
        borderRadius: 8,
        '&:before': { display: 'none' },
        '& .MuiAccordionSummary-root': {
            minHeight: 40,
            padding: '0 12px',
            '&.Mui-expanded': { minHeight: 40 },
        },
        '& .MuiAccordionSummary-content': {
            margin: '8px 0',
            '&.Mui-expanded': { margin: '8px 0' },
        },
        '& .MuiAccordionDetails-root': {
            padding: '8px 12px 12px',
            flexDirection: 'column',
        },
    },
    floorHeader: {
        display: 'flex', alignItems: 'center', gap: 8, width: '100%', justifyContent: 'space-between',
    },
    floorTitle: { fontSize: 13, fontWeight: 500, color: T.textPrimary, fontFamily: T.fontBody },
    floorSubtitle: { fontSize: 11, color: 'rgba(255, 255, 255, 0.4)', fontFamily: T.fontBody },
    restrictionRow: T.restrictionRow,
    restrictionFields: T.restrictionFields,
    restrictionFieldRow: T.restrictionFieldRow,
}));

const tableStyles = T.tableStyles;

const EMPTY_FLOOR = { name: '', coords: { x: '', y: '', z: '', w: '' }, zone: { center: { x: '', y: '', z: '' }, length: '1.5', width: '1.5', heading: '0', minZ: '', maxZ: '' }, defaultLocked: false, restricted: [], bypassLock: [] };
const EMPTY_RESTRICTION = { type: 'job', job: '', workplace: '', grade: '', gradeLevel: '', reqDuty: false, SID: '', key: '', value: '', jobPermission: '' };

const RestrictionEditor = ({ classes, restrictions, onChange, label }) => {
    const add = () => onChange([...restrictions, { ...EMPTY_RESTRICTION }]);
    const remove = (idx) => onChange(restrictions.filter((_, i) => i !== idx));
    const update = (idx, field, value) => onChange(restrictions.map((r, i) => i === idx ? { ...r, [field]: value } : r));

    return (
        <>
            <div className={classes.sectionLabel} style={{ marginTop: 4 }}>
                {label} <span style={{ fontSize: 10, fontWeight: 400, color: 'rgba(255,255,255,0.3)', marginLeft: 8 }}>(optional)</span>
            </div>
            {restrictions.map((restriction, idx) => (
                <div key={idx} className={classes.restrictionRow}>
                    <div className={classes.restrictionFields}>
                        <FormControl variant="outlined" size="small" className={classes.smallField} fullWidth>
                            <InputLabel>Type</InputLabel>
                            <Select value={restriction.type} onChange={(e) => update(idx, 'type', e.target.value)} label="Type" MenuProps={{ className: classes.selectMenu }}>
                                <MenuItem value="job">Job</MenuItem>
                                <MenuItem value="character">Character (SID)</MenuItem>
                                <MenuItem value="propertyData">Property Data</MenuItem>
                            </Select>
                        </FormControl>
                        {restriction.type === 'job' && (<>
                            <div className={classes.restrictionFieldRow}>
                                <TextField className={classes.smallField} label="Job ID" variant="outlined" size="small" fullWidth value={restriction.job} onChange={(e) => update(idx, 'job', e.target.value)} placeholder="e.g. police" />
                                <TextField className={classes.smallField} label="Workplace" variant="outlined" size="small" fullWidth value={restriction.workplace} onChange={(e) => update(idx, 'workplace', e.target.value)} placeholder="(optional)" />
                            </div>
                            <div className={classes.restrictionFieldRow}>
                                <TextField className={classes.smallField} label="Grade" variant="outlined" size="small" fullWidth value={restriction.grade} onChange={(e) => update(idx, 'grade', e.target.value)} placeholder="(optional)" />
                                <TextField className={classes.smallField} label="Grade Level" variant="outlined" size="small" fullWidth type="number" value={restriction.gradeLevel} onChange={(e) => update(idx, 'gradeLevel', e.target.value)} />
                                <FormControlLabel className={classes.switchLabel} style={{ marginLeft: 0 }} control={<Switch checked={restriction.reqDuty} onChange={(e) => update(idx, 'reqDuty', e.target.checked)} color="secondary" size="small" />} label="Duty" />
                            </div>
                            <TextField className={classes.smallField} label="Job Permission" variant="outlined" size="small" fullWidth value={restriction.jobPermission || ''} onChange={(e) => update(idx, 'jobPermission', e.target.value)} placeholder="(optional)" />
                        </>)}
                        {restriction.type === 'character' && (
                            <TextField className={classes.smallField} label="State ID (SID)" variant="outlined" size="small" fullWidth type="number" value={restriction.SID} onChange={(e) => update(idx, 'SID', e.target.value)} />
                        )}
                        {restriction.type === 'propertyData' && (
                            <div className={classes.restrictionFieldRow}>
                                <TextField className={classes.smallField} label="Key" variant="outlined" size="small" fullWidth value={restriction.key} onChange={(e) => update(idx, 'key', e.target.value)} />
                                <TextField className={classes.smallField} label="Value" variant="outlined" size="small" fullWidth value={restriction.value} onChange={(e) => update(idx, 'value', e.target.value)} />
                            </div>
                        )}
                    </div>
                    <button style={{ ...tableStyles.btnDanger, marginTop: 2 }} onClick={() => remove(idx)}><FontAwesomeIcon icon={['fas', 'xmark']} /></button>
                </div>
            ))}
            <Button variant="outlined" size="small" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: 11, textTransform: 'none', color: '#4db8c4', borderColor: 'rgba(32, 134, 146, 0.3)', marginBottom: 8 }} onClick={add}>
                <FontAwesomeIcon icon={['fas', 'plus']} style={{ marginRight: 6 }} /> Add Restriction
            </Button>
        </>
    );
};

const serializeRestrictions = (list) => {
    return (list || []).filter(r => r.type).map(r => {
        const c = { type: r.type };
        if (r.type === 'job') {
            if (r.job) c.job = r.job;
            if (r.workplace) c.workplace = r.workplace;
            if (r.grade) c.grade = r.grade;
            if (r.gradeLevel) c.gradeLevel = Number(r.gradeLevel);
            c.reqDuty = r.reqDuty || false;
            if (r.jobPermission) c.jobPermission = r.jobPermission;
        } else if (r.type === 'character') {
            c.SID = Number(r.SID);
        } else if (r.type === 'propertyData') {
            c.key = r.key;
            c.value = r.value;
        }
        return c;
    });
};

const parseRestrictions = (list) => {
    return (list || []).map(r => ({
        ...EMPTY_RESTRICTION,
        ...r,
        gradeLevel: r.gradeLevel != null ? String(r.gradeLevel) : '',
        SID: r.SID != null ? String(r.SID) : '',
        jobPermission: r.jobPermission || '',
    }));
};

const round2 = (n) => Math.round(n * 100) / 100;

export default () => {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [elevators, setElevators] = useState([]);
    const [search, setSearch] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingElevator, setEditingElevator] = useState(null);
    const [saving, setSaving] = useState(false);

    // Form state
    const [formName, setFormName] = useState('');
    const [formId, setFormId] = useState('');
    const [formCanLock, setFormCanLock] = useState([]);
    const [formFloors, setFormFloors] = useState({});
    const [expandedFloor, setExpandedFloor] = useState(null);
    const [captureFloorKey, setCaptureFloorKey] = useState(null);
    const [captureType, setCaptureType] = useState(null);

    const fetchElevators = useCallback(async () => {
        setLoading(true);
        try {
            const res = await Nui.send('GetElevatorList');
            if (res) {
                const data = await res.json();
                if (data && Array.isArray(data)) {
                    setElevators(data.filter(e => !e.removed));
                }
            }
        } catch (e) {}
        setLoading(false);
    }, []);

    useEffect(() => { fetchElevators(); }, []);

    // Listen for capture events
    useEffect(() => {
        const handler = (event) => {
            if (event.data && event.data.type === 'ELEVATOR_ZONE_CAPTURED') {
                const d = event.data.data;
                if (d && captureFloorKey != null) {
                    setFormFloors(prev => {
                        const floor = { ...(prev[captureFloorKey] || { ...EMPTY_FLOOR }) };
                        floor.zone = {
                            center: { x: String(round2(d.center.x)), y: String(round2(d.center.y)), z: String(round2(d.center.z)) },
                            length: String(d.length || 1.5),
                            width: String(d.width || 1.5),
                            heading: String(round2(d.heading || 0)),
                            minZ: String(round2(d.minZ)),
                            maxZ: String(round2(d.maxZ)),
                        };
                        return { ...prev, [captureFloorKey]: floor };
                    });
                    setDialogOpen(true);
                    setExpandedFloor(captureFloorKey);
                    toast.success('Zone captured - fields updated');
                }
            }
            if (event.data && event.data.type === 'ELEVATOR_POSITION_CAPTURED') {
                const d = event.data.data;
                if (d && captureFloorKey != null) {
                    setFormFloors(prev => {
                        const floor = { ...(prev[captureFloorKey] || { ...EMPTY_FLOOR }) };
                        floor.coords = {
                            x: String(round2(d.x)),
                            y: String(round2(d.y)),
                            z: String(round2(d.z)),
                            w: String(round2(d.w)),
                        };
                        return { ...prev, [captureFloorKey]: floor };
                    });
                    setDialogOpen(true);
                    setExpandedFloor(captureFloorKey);
                    toast.success('Position captured - coordinates updated');
                }
            }
        };
        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, [captureFloorKey]);

    const filteredElevators = useMemo(() => {
        if (!search) return elevators;
        const s = search.toLowerCase();
        return elevators.filter(e =>
            (e.name && e.name.toLowerCase().includes(s)) ||
            (e.id && String(e.id).toLowerCase().includes(s)) ||
            String(e.index).includes(s)
        );
    }, [elevators, search]);

    const floorCount = (e) => e.floors ? Object.keys(e.floors).length : 0;

    const handleDelete = async (elevator) => {
        try {
            const res = await Nui.send('DeleteElevator', { index: elevator.index });
            if (res) {
                const data = await res.json();
                if (data && data.success) {
                    toast.success(data.message);
                    setElevators(prev => prev.filter(e => e.index !== elevator.index));
                } else toast.error(data?.message || 'Failed');
            }
        } catch (e) { toast.error('Failed to delete elevator'); }
    };

    const openCreateDialog = () => {
        setEditingElevator(null);
        setFormName('');
        setFormId('');
        setFormCanLock([]);
        setFormFloors({});
        setExpandedFloor(null);
        setCaptureFloorKey(null);
        setDialogOpen(true);
    };

    const openEditDialog = (elevator) => {
        setEditingElevator(elevator);
        setFormName(elevator.name || '');
        setFormId(elevator.id || '');
        setFormCanLock(parseRestrictions(elevator.canLock));

        const floors = {};
        if (elevator.floors) {
            for (const [key, f] of Object.entries(elevator.floors)) {
                floors[key] = {
                    name: f.name || '',
                    coords: {
                        x: f.coords ? String(f.coords.x) : '',
                        y: f.coords ? String(f.coords.y) : '',
                        z: f.coords ? String(f.coords.z) : '',
                        w: f.coords ? String(f.coords.w || 0) : '',
                    },
                    zone: f.zone ? {
                        center: {
                            x: f.zone.center ? String(f.zone.center.x) : '',
                            y: f.zone.center ? String(f.zone.center.y) : '',
                            z: f.zone.center ? String(f.zone.center.z) : '',
                        },
                        length: String(f.zone.length || 1.5),
                        width: String(f.zone.width || 1.5),
                        heading: String(f.zone.heading || 0),
                        minZ: String(f.zone.minZ || 0),
                        maxZ: String(f.zone.maxZ || 0),
                    } : { center: { x: '', y: '', z: '' }, length: '1.5', width: '1.5', heading: '0', minZ: '', maxZ: '' },
                    defaultLocked: f.defaultLocked || false,
                    restricted: parseRestrictions(f.restricted),
                    bypassLock: parseRestrictions(f.bypassLock),
                };
            }
        }
        setFormFloors(floors);
        setExpandedFloor(null);
        setCaptureFloorKey(null);
        setDialogOpen(true);
    };

    const addFloor = () => {
        const existingKeys = Object.keys(formFloors).map(Number);
        let newKey = 1;
        while (existingKeys.includes(newKey)) newKey++;
        setFormFloors(prev => ({
            ...prev,
            [String(newKey)]: { ...EMPTY_FLOOR, name: '', coords: { x: '', y: '', z: '', w: '' }, zone: { center: { x: '', y: '', z: '' }, length: '1.5', width: '1.5', heading: '0', minZ: '', maxZ: '' }, defaultLocked: false, restricted: [], bypassLock: [] },
        }));
        setExpandedFloor(String(newKey));
    };

    const removeFloor = (key) => {
        setFormFloors(prev => {
            const next = { ...prev };
            delete next[key];
            return next;
        });
    };

    const updateFloor = (key, field, value) => {
        setFormFloors(prev => ({
            ...prev,
            [key]: { ...prev[key], [field]: value },
        }));
    };

    const updateFloorCoord = (key, axis, value) => {
        setFormFloors(prev => ({
            ...prev,
            [key]: { ...prev[key], coords: { ...prev[key].coords, [axis]: value } },
        }));
    };

    const updateFloorZone = (key, field, value) => {
        setFormFloors(prev => ({
            ...prev,
            [key]: { ...prev[key], zone: { ...prev[key].zone, [field]: value } },
        }));
    };

    const updateFloorZoneCenter = (key, axis, value) => {
        setFormFloors(prev => ({
            ...prev,
            [key]: { ...prev[key], zone: { ...prev[key].zone, center: { ...prev[key].zone.center, [axis]: value } } },
        }));
    };

    const changeFloorNumber = (oldKey, newKey) => {
        if (newKey === '' || newKey === oldKey) return;
        if (formFloors[newKey]) {
            toast.error('Floor number already exists');
            return;
        }
        setFormFloors(prev => {
            const next = { ...prev };
            next[newKey] = next[oldKey];
            delete next[oldKey];
            return next;
        });
        if (expandedFloor === oldKey) setExpandedFloor(newKey);
    };

    const handleCaptureZone = async (floorKey) => {
        setCaptureFloorKey(floorKey);
        setCaptureType('zone');
        setDialogOpen(false);
        try { await Nui.send('StartElevatorZoneHelper'); } catch (e) {}
    };

    const handleCapturePosition = async (floorKey) => {
        setCaptureFloorKey(floorKey);
        setCaptureType('position');
        setDialogOpen(false);
        try { await Nui.send('StartElevatorPositionHelper'); } catch (e) {}
    };

    const handleSave = async () => {
        if (!formName) { toast.error('Elevator name is required'); return; }
        if (Object.keys(formFloors).length === 0) { toast.error('At least one floor is required'); return; }

        // Validate floors have coords and zone
        for (const [key, floor] of Object.entries(formFloors)) {
            if (!floor.coords.x || !floor.coords.y || !floor.coords.z) {
                toast.error(`Floor ${key}: Teleport coordinates are required`);
                return;
            }
            if (!floor.zone.center.x || !floor.zone.center.y || !floor.zone.center.z) {
                toast.error(`Floor ${key}: Zone center is required`);
                return;
            }
        }

        setSaving(true);

        const payload = {
            id: formId || false,
            name: formName,
            canLock: serializeRestrictions(formCanLock),
            floors: {},
        };

        for (const [key, floor] of Object.entries(formFloors)) {
            payload.floors[key] = {
                name: floor.name || `Floor ${key}`,
                coords: {
                    x: Number(floor.coords.x),
                    y: Number(floor.coords.y),
                    z: Number(floor.coords.z),
                    w: Number(floor.coords.w || 0),
                },
                zone: {
                    center: {
                        x: Number(floor.zone.center.x),
                        y: Number(floor.zone.center.y),
                        z: Number(floor.zone.center.z),
                    },
                    length: Number(floor.zone.length) || 1.5,
                    width: Number(floor.zone.width) || 1.5,
                    heading: Number(floor.zone.heading) || 0,
                    minZ: Number(floor.zone.minZ),
                    maxZ: Number(floor.zone.maxZ),
                },
                defaultLocked: floor.defaultLocked || false,
                restricted: serializeRestrictions(floor.restricted),
                bypassLock: serializeRestrictions(floor.bypassLock),
            };
        }

        try {
            if (editingElevator) {
                payload.index = editingElevator.index;
                const res = await Nui.send('UpdateElevator', payload);
                if (res) {
                    const data = await res.json();
                    if (data && data.success) { toast.success(data.message); setDialogOpen(false); fetchElevators(); }
                    else toast.error(data?.message || 'Failed to update');
                }
            } else {
                const res = await Nui.send('CreateElevator', payload);
                if (res) {
                    const data = await res.json();
                    if (data && data.success) { toast.success(data.message); setDialogOpen(false); fetchElevators(); }
                    else toast.error(data?.message || 'Failed to create');
                }
            }
        } catch (e) { toast.error('Operation failed'); }
        setSaving(false);
    };

    const sortedFloorKeys = useMemo(() => {
        return Object.keys(formFloors).sort((a, b) => Number(a) - Number(b));
    }, [formFloors]);

    return (
        <div className={classes.wrapper}>
            {/* Header */}
            <div className={classes.header}>
                <div className={classes.headerLeft}>
                    <div>
                        <div className={classes.title}>
                            <FontAwesomeIcon icon={['fas', 'elevator']} style={{ marginRight: 8, color: '#208692' }} />
                            Elevator Tool
                        </div>
                        <div className={classes.subtitle}>Manage elevators and create dynamic elevators</div>
                    </div>
                </div>
                <div className={classes.headerActions}>
                    <button style={tableStyles.headerBtn('rgba(32, 134, 146, 0.15)', 'rgba(32, 134, 146, 0.3)', '#4db8c4')} onClick={openCreateDialog} disabled={loading}>
                        <FontAwesomeIcon icon={['fas', 'plus']} /> New Elevator
                    </button>
                    <button style={tableStyles.iconBtn} onClick={fetchElevators} disabled={loading}>
                        <FontAwesomeIcon icon={['fas', 'arrows-rotate']} spin={loading} />
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className={classes.statsRow}>
                <span style={tableStyles.stat('rgba(255, 255, 255, 0.08)')}>Total: {elevators.length}</span>
                <span style={tableStyles.stat('rgba(32, 134, 146, 0.3)')}>Floors: {elevators.reduce((sum, e) => sum + floorCount(e), 0)}</span>
            </div>

            {/* Search */}
            <div className={classes.filterRow}>
                <TextField className={classes.searchField} variant="outlined" size="small" placeholder="Search elevators..."
                    value={search} onChange={(e) => setSearch(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start"><FontAwesomeIcon icon={['fas', 'search']} /></InputAdornment> }}
                />
            </div>

            {/* Table */}
            <div className={classes.tableContainer}>
                <table style={tableStyles.table}>
                    <thead>
                        <tr>
                            <th style={{ ...tableStyles.th, width: 50 }}>#</th>
                            <th style={tableStyles.th}>Name</th>
                            <th style={tableStyles.th}>ID</th>
                            <th style={{ ...tableStyles.th, width: 60, textAlign: 'center' }}>Floors</th>
                            <th style={{ ...tableStyles.th, width: 80, textAlign: 'center' }}>Can Lock</th>
                            <th style={{ ...tableStyles.th, width: 100, textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center' }}><Loader text="Loading Elevator Data" /></td></tr>
                        ) : filteredElevators.length === 0 ? (
                            <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>No elevators found</td></tr>
                        ) : filteredElevators.map((elevator) => (
                            <tr key={elevator.index} style={{ transition: 'background 0.1s' }} onMouseEnter={e => e.currentTarget.style.background='rgba(32,134,146,0.05)'} onMouseLeave={e => e.currentTarget.style.background=''}>
                                <td style={{ ...tableStyles.td, ...tableStyles.mono }}>{elevator.index}</td>
                                <td style={{ ...tableStyles.td, fontWeight: 500, color: '#fff' }}>{elevator.name || '(unnamed)'}</td>
                                <td style={{ ...tableStyles.td, ...tableStyles.mono, color: elevator.id ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)' }}>{elevator.id || '(none)'}</td>
                                <td style={{ ...tableStyles.td, textAlign: 'center' }}>
                                    <span style={tableStyles.badge}>{floorCount(elevator)}</span>
                                </td>
                                <td style={{ ...tableStyles.td, textAlign: 'center' }}>
                                    {elevator.canLock && elevator.canLock.length > 0
                                        ? <span style={tableStyles.badge}>{elevator.canLock.length}</span>
                                        : <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>None</span>}
                                </td>
                                <td style={{ ...tableStyles.td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                                    <button style={tableStyles.btn} title="Edit" onClick={() => openEditDialog(elevator)}><FontAwesomeIcon icon={['fas', 'pen-to-square']} /></button>
                                    <button style={tableStyles.btnDanger} title="Delete" onClick={() => handleDelete(elevator)}><FontAwesomeIcon icon={['fas', 'trash']} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} className={classes.dialog} hideBackdrop>
                <DialogTitle className={classes.dialogTitle}>
                    <FontAwesomeIcon icon={['fas', editingElevator ? 'pen-to-square' : 'plus']} style={{ marginRight: 8, color: '#208692' }} />
                    {editingElevator ? `Edit Elevator: ${editingElevator.name || `#${editingElevator.index}`}` : 'Create New Elevator'}
                </DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    <div className={classes.sectionLabel}>Elevator Info</div>
                    <TextField className={classes.formField} label="Elevator Name" variant="outlined" size="small" fullWidth
                        value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. MRPD Elevator" />
                    <TextField className={classes.formField} label="Elevator ID (optional)" variant="outlined" size="small" fullWidth
                        value={formId} onChange={(e) => setFormId(e.target.value)} placeholder="e.g. mrpd-elevator" />

                    <RestrictionEditor classes={classes} restrictions={formCanLock} onChange={setFormCanLock} label="Can Lock (who can lock/unlock floors)" />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                        <div className={classes.sectionLabel} style={{ margin: 0 }}>Floors ({sortedFloorKeys.length})</div>
                        <button style={tableStyles.headerBtn('rgba(32, 134, 146, 0.15)', 'rgba(32, 134, 146, 0.3)', '#4db8c4')} onClick={addFloor}>
                            <FontAwesomeIcon icon={['fas', 'plus']} /> Add Floor
                        </button>
                    </div>

                    {sortedFloorKeys.length === 0 && (
                        <div style={{ textAlign: 'center', padding: 20, color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
                            No floors added yet. Click "Add Floor" to start.
                        </div>
                    )}

                    {sortedFloorKeys.map((key) => {
                        const floor = formFloors[key];
                        return (
                            <Accordion key={key} expanded={expandedFloor === key} onChange={() => setExpandedFloor(expandedFloor === key ? null : key)} className={classes.floorCard}>
                                <AccordionSummary>
                                    <div className={classes.floorHeader}>
                                        <div>
                                            <span className={classes.floorTitle}>Floor {key}: {floor.name || '(unnamed)'}</span>
                                            {floor.defaultLocked && <span style={{ ...tableStyles.badge, marginLeft: 8, fontSize: 9 }}>LOCKED</span>}
                                        </div>
                                        <button style={{ ...tableStyles.btnDanger, zIndex: 2 }} onClick={(e) => { e.stopPropagation(); removeFloor(key); }} title="Remove Floor">
                                            <FontAwesomeIcon icon={['fas', 'trash']} />
                                        </button>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <div className={classes.formRow} style={{ marginBottom: 8 }}>
                                        <TextField className={classes.smallField} label="Floor Number" variant="outlined" size="small" type="number"
                                            defaultValue={key}
                                            onBlur={(e) => changeFloorNumber(key, e.target.value)}
                                            style={{ maxWidth: 120 }}
                                        />
                                        <TextField className={classes.smallField} label="Floor Name" variant="outlined" size="small" fullWidth
                                            value={floor.name} onChange={(e) => updateFloor(key, 'name', e.target.value)} placeholder="e.g. Ground Floor" />
                                    </div>

                                    <FormControlLabel className={classes.switchLabel} control={<Switch checked={floor.defaultLocked} onChange={(e) => updateFloor(key, 'defaultLocked', e.target.checked)} color="secondary" size="small" />} label="Default Locked" />

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                                        <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(32, 134, 146, 0.7)', textTransform: 'uppercase' }}>Teleport Position</span>
                                        <button style={tableStyles.captureBtn} onClick={() => handleCapturePosition(key)}>
                                            <FontAwesomeIcon icon={['fas', 'crosshairs']} /> Capture
                                        </button>
                                    </div>
                                    <div className={classes.formRow} style={{ marginTop: 4, marginBottom: 8 }}>
                                        <TextField className={classes.smallField} label="X" variant="outlined" size="small" fullWidth
                                            value={floor.coords.x} onChange={(e) => updateFloorCoord(key, 'x', e.target.value)} />
                                        <TextField className={classes.smallField} label="Y" variant="outlined" size="small" fullWidth
                                            value={floor.coords.y} onChange={(e) => updateFloorCoord(key, 'y', e.target.value)} />
                                        <TextField className={classes.smallField} label="Z" variant="outlined" size="small" fullWidth
                                            value={floor.coords.z} onChange={(e) => updateFloorCoord(key, 'z', e.target.value)} />
                                        <TextField className={classes.smallField} label="Heading" variant="outlined" size="small" fullWidth
                                            value={floor.coords.w} onChange={(e) => updateFloorCoord(key, 'w', e.target.value)} />
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(32, 134, 146, 0.7)', textTransform: 'uppercase' }}>Targeting Zone</span>
                                        <button style={tableStyles.captureBtn} onClick={() => handleCaptureZone(key)}>
                                            <FontAwesomeIcon icon={['fas', 'crosshairs']} /> Capture
                                        </button>
                                    </div>
                                    <div className={classes.formRow} style={{ marginTop: 4 }}>
                                        <TextField className={classes.smallField} label="Center X" variant="outlined" size="small" fullWidth
                                            value={floor.zone.center.x} onChange={(e) => updateFloorZoneCenter(key, 'x', e.target.value)} />
                                        <TextField className={classes.smallField} label="Center Y" variant="outlined" size="small" fullWidth
                                            value={floor.zone.center.y} onChange={(e) => updateFloorZoneCenter(key, 'y', e.target.value)} />
                                        <TextField className={classes.smallField} label="Center Z" variant="outlined" size="small" fullWidth
                                            value={floor.zone.center.z} onChange={(e) => updateFloorZoneCenter(key, 'z', e.target.value)} />
                                    </div>
                                    <div className={classes.formRow} style={{ marginTop: 4, marginBottom: 8 }}>
                                        <TextField className={classes.smallField} label="Length" variant="outlined" size="small" fullWidth type="number"
                                            value={floor.zone.length} onChange={(e) => updateFloorZone(key, 'length', e.target.value)} />
                                        <TextField className={classes.smallField} label="Width" variant="outlined" size="small" fullWidth type="number"
                                            value={floor.zone.width} onChange={(e) => updateFloorZone(key, 'width', e.target.value)} />
                                        <TextField className={classes.smallField} label="Heading" variant="outlined" size="small" fullWidth type="number"
                                            value={floor.zone.heading} onChange={(e) => updateFloorZone(key, 'heading', e.target.value)} />
                                        <TextField className={classes.smallField} label="Min Z" variant="outlined" size="small" fullWidth type="number"
                                            value={floor.zone.minZ} onChange={(e) => updateFloorZone(key, 'minZ', e.target.value)} />
                                        <TextField className={classes.smallField} label="Max Z" variant="outlined" size="small" fullWidth type="number"
                                            value={floor.zone.maxZ} onChange={(e) => updateFloorZone(key, 'maxZ', e.target.value)} />
                                    </div>

                                    <RestrictionEditor classes={classes} restrictions={floor.restricted || []} onChange={(v) => updateFloor(key, 'restricted', v)} label="Floor Restrictions (who can use this floor)" />
                                    <RestrictionEditor classes={classes} restrictions={floor.bypassLock || []} onChange={(v) => updateFloor(key, 'bypassLock', v)} label="Bypass Lock (who can use when locked)" />
                                </AccordionDetails>
                            </Accordion>
                        );
                    })}
                </DialogContent>
                <DialogActions className={classes.dialogActions}>
                    <Button style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'none', fontSize: 12 }} onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, background: 'rgba(32,134,146,0.2)', color: '#4db8c4', border: '1px solid rgba(32,134,146,0.3)', textTransform: 'none', fontSize: 12 }} onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : (editingElevator ? 'Update Elevator' : 'Create Elevator')}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
