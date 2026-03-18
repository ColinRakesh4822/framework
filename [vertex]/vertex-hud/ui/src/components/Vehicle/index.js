import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';

const Wrapper = styled(Box)(() => ({
  width: '12vw',
  height: '12vw',
  minWidth: '150px',
  minHeight: '150px',
  maxWidth: '220px',
  maxHeight: '220px',
  borderRadius: '50%',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
}));

const Container = styled(Box)(({ position = 'right' }) => ({
  position: 'absolute',
  bottom: '1vh',
  right: '2vw', // Override position setting if layout is forced
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  zIndex: 1000,
}));

const Labels = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 12,
  marginTop: -16,
}));

const LabelColumn = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 4,
}));

const LabelText = styled(Typography)(() => ({
  color: '#ccc',
  fontSize: '0.7vw',
  minFontSize: '10px',
  fontWeight: 500,
  '@media (min-width: 1920px)': {
    fontSize: '12px',
  },
}));

const LabelBar = styled(Box)(({ color, width = '100%' }) => ({
  height: '0.3vh',
  minHeight: '2px',
  width: width,
  backgroundColor: color,
  borderRadius: '2px',
  transition: 'width 0.3s ease, background-color 0.3s ease',
}));

const TickContainer = styled(Box)(() => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  borderRadius: '50%',
  pointerEvents: 'none',
}));

const Arc = styled('svg')({
  position: 'absolute',
  top: 0,
  left: 0,
  transform: 'rotate(135deg)',
  overflow: 'visible',
});

const Speedometer = () => {
  const config = useSelector((state) => state.hud.config);
  const showing = useSelector((state) => state.vehicle.showing);
  const ignition = useSelector((state) => state.vehicle.ignition);
  const speed = useSelector((state) => state.vehicle.speed);
  const speedMeasure = useSelector((state) => state.vehicle.speedMeasure);
  const seatbelt = useSelector((state) => state.vehicle.seatbelt);
  const fuel = useSelector((state) => state.vehicle.fuel) || 0;
  const rawRpm = useSelector((state) => state.vehicle.rpm) || 0;
  const gear = useSelector((state) => state.vehicle.gear) || 1;

  const maxRpm = 1.0; // Normalized in FiveM Lua from 0.0 to 1.0 usually
  const totalArc = 270;
  const rpmPercent = Math.min((rawRpm / maxRpm) * 100, 100);
  const angle = (rpmPercent / 100) * totalArc;

  if (!showing) return null;

  return (
    <Fade in={true}>
      <Container position={config.vehicleHudPosition}>
        <Box mt={10}>
          <Wrapper>
            <Arc width="220" height="220">
              {/* Background Arc */}
              <circle
                r="100"
                cx="110"
                cy="110"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 100 * (totalArc / 360)} ${2 * Math.PI * 100}`}
                strokeLinecap="round"
              />

              {/* Foreground Arc (Yellow RPM/Speed Indicator) */}
              {rawRpm > 0 && (
                <circle
                  r="100"
                  cx="110"
                  cy="110"
                  fill="none"
                  stroke="#F5BD1F"
                  strokeWidth="8"
                  strokeDasharray={`${(2 * Math.PI * 100 * (angle / 360)).toFixed(2)} ${2 * Math.PI * 100}`}
                  strokeLinecap="round"
                  transform="rotate(0 110 110)"
                />
              )}
            </Arc>

            {/* Tick Marks */}
            <TickContainer>
              {Array.from({ length: 8 }).map((_, i) => {
                const totalTicks = 8;
                const startAngle = 135;
                const endAngle = 405;
                const tickAngle = startAngle + (i * (endAngle - startAngle)) / (totalTicks - 1);
                const rad = (tickAngle * Math.PI) / 180;

                const center = 110;
                const radiusTick = 98;
                const radiusText = 120;

                const tickX = center + radiusTick * Math.cos(rad);
                const tickY = center + radiusTick * Math.sin(rad);
                const textX = center + radiusText * Math.cos(rad);
                const textY = center + radiusText * Math.sin(rad);

                return (
                  <React.Fragment key={i}>
                    <Box
                      sx={{
                        position: 'absolute',
                        width: 3,
                        height: 12,
                        backgroundColor: '#ffffff',
                        opacity: 0.8,
                        top: tickY,
                        left: tickX,
                        transform: `translate(-50%, -50%) rotate(${tickAngle + 90}deg)`,
                        transformOrigin: 'center center',
                        borderRadius: i === 0 || i === 7 ? '0 0 2px 2px' : 0,
                      }}
                    />
                    <Typography
                      sx={{
                        position: 'absolute',
                        top: textY,
                        left: textX,
                        transform: 'translate(-50%, -50%)',
                        fontSize: 15,
                        fontWeight: 700,
                        color: '#ffffff',
                        fontFamily: '"Oswald"',
                      }}
                    >
                      {i + 1}
                    </Typography>
                  </React.Fragment>
                );
              })}
            </TickContainer>

            {/* Speed & Gear in Center */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#ccc',
                  textTransform: 'uppercase',
                  letterSpacing: 1.2,
                  lineHeight: 1,
                  fontFamily: '"Oswald"',
                }}
              >
                {speedMeasure}
              </Typography>
              <Typography
                sx={{
                  fontSize: 44,
                  fontWeight: 800,
                  color: '#ffffff',
                  fontFamily: '"Oswald"',
                  letterSpacing: '1px',
                  lineHeight: 1.1,
                  marginTop: '1px',
                }}
              >
                {String(speed).padStart(3, '0')}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '3px',
                }}
              >
                <div style={{ width: 2, height: 16, background: '#F5BD1F' }}></div>
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: '#ffffff',
                    fontFamily: '"Oswald"',
                    lineHeight: 1,
                  }}
                >
                  {gear}
                </Typography>
              </Box>
            </Box>
          </Wrapper>
        </Box>
      </Container>
    </Fade>
  );
};

export default Speedometer;
