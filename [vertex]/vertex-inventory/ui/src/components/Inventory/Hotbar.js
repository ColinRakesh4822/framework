import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { Slide } from '@mui/material';
import { makeStyles } from '@mui/styles';

import Slot from './Slot';
import { getItemImage } from './item';

const useStyles = makeStyles((theme) => ({
	slide: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		gap: 15,
	},
	equipped: {
		marginRight: 20,
	},
	hotbarSlot: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	slotName: {
		color: '#ffffff',
		fontSize: '12px',
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: '5px',
		textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
	},
}));

export default connect()((props) => {
	const classes = useStyles();
	const hidden = useSelector((state) => state.app.showHotbar);
	const showing = useSelector((state) => state.app.showing);
	const hbItems = useSelector((state) => state.app.hotbarItems);
	const equipped = useSelector((state) => state.app.equipped);
	const items = useSelector((state) => state.inventory.items);
	const itemsLoaded = useSelector((state) => state.inventory.itemsLoaded);
	const playerInventory = useSelector((state) => state.inventory.player);

	const mode = useSelector((state) => state.app.mode);

	useEffect(() => {
		let tmr = null;
		if (hidden) {
			tmr = setTimeout(() => {
				props.dispatch({
					type: 'HOTBAR_HIDE',
				});
			}, 5000);

			return () => {
				clearTimeout(tmr);
			};
		}
	}, [hidden]);

	if (mode === 'crafting') {
		return null;
	}

	if (!itemsLoaded || !Boolean(hbItems) || Object.keys(items).length == 0)
		return null;
	return (
		<Slide direction="up" in={hidden} className={classes.slide}>
			<div>
				{[...Array(5).keys()].map((value) => {
					const utilitySlot = value + 5; // Utility envanterdeki slot 5-9
					const slotNames = ['WEAPON SLOT 1', 'WEAPON SLOT 2', 'HOTKEY SLOT 3', 'HOTKEY SLOT 4', 'HOTKEY SLOT 5'];
					return (
						<div key={utilitySlot} className={classes.hotbarSlot}>
							<div className={classes.slotName}>
								{slotNames[value]}
							</div>
							<Slot
								mini
								solid
								inHotbar={true}
								showing={showing}
								slot={utilitySlot}
								owner="utility"
								invType={3}
								hotkeys={true}
								data={
									hbItems.filter((s) => s.Slot == utilitySlot)
										? hbItems.filter(
												(s) => s.Slot == utilitySlot,
										  )[0]
										: {}
								}
							/>
						</div>
					);
				})}
				{Boolean(equipped) && (
					<Slot
						mini
						solid
						equipped
						inHotbar={true}
						showing={showing}
						owner={playerInventory.owner}
						invType={playerInventory.invType}
						slot={equipped.Slot}
						hotkeys={false}
						data={equipped}
					/>
				)}
			</div>
		</Slide>
	);
});
