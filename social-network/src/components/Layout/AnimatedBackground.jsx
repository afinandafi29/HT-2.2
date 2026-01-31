import { useTheme } from '../../contexts/ThemeContext';
import BubbleBackground from '../themes/Bubble';
import FireworksBackground from '../themes/Fireworks';
import GradientBackground from '../themes/Gradient';
import GravityStarsBackground from '../themes/GravityStars';
import HexagonBackground from '../themes/Hexagon';
import HoleBackground from '../themes/Hole';
import StarsBackground from '../themes/Stars';
import LiquidEther from '../themes/LiquidEther';
import Prism from '../themes/Prism';
import DarkVeil from '../themes/DarkVeil';
import LightPillar from '../themes/LightPillar';
import Silk from '../themes/Silk';
import FloatingLines from '../themes/FloatingLines';
import LightRays from '../themes/LightRays';
import PixelBlast from '../themes/PixelBlast';
import ColorBends from '../themes/ColorBends';
import Aurora from '../themes/Aurora';
import Plasma from '../themes/Plasma';
import Galaxy from '../themes/Galaxy';

const AnimatedBackground = () => {
    const { animatedTheme, theme } = useTheme();

    if (!animatedTheme || animatedTheme === 'none') {
        return null;
    }

    const renderTheme = () => {
        const isDark = theme === 'space' || theme === 'dark';

        switch (animatedTheme) {
            case 'bubble':
                return <BubbleBackground interactive={true} />;
            case 'fireworks':
                return <FireworksBackground population={100} color={isDark ? '#FFFFFF' : '#000000'} />;
            case 'gradient':
                return <GradientBackground />;
            case 'gravity-stars':
                return <GravityStarsBackground starCount={150} />;
            case 'hexagon':
                return <HexagonBackground />;
            case 'hole':
                return <HoleBackground />;
            case 'stars':
                return <StarsBackground starColor={isDark ? '#FFFFFF' : '#000000'} />;
            case 'liquid-ether':
                return <LiquidEther />;
            case 'prism':
                return <Prism />;
            case 'dark-veil':
                return <DarkVeil />;
            case 'light-pillar':
                return <LightPillar interactive={true} />;
            case 'silk':
                return <Silk />;
            case 'floating-lines':
                return <FloatingLines />;
            case 'light-rays':
                return <LightRays />;
            case 'pixel-blast':
                return <PixelBlast />;
            case 'color-bends':
                return <ColorBends />;
            case 'aurora':
                return <Aurora />;
            case 'plasma':
                return <Plasma />;
            case 'galaxy':
                return <Galaxy />;
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[-5] overflow-hidden">
            {renderTheme()}
        </div>
    );
};

export default AnimatedBackground;
