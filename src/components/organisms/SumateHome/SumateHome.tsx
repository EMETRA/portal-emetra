/* eslint-disable @next/next/no-img-element */
import styles from './SumateHome.module.scss';
import bgImage from '@assets/images/bg-autopista.jpg'; 
import logo from '@assets/images/logos.png';
import acmo from '@assets/logos/ACMO.png';
import asim from '@assets/logos/ASIM.png';
import avanti from '@assets/logos/Avanti.png';
import bi from '@assets/logos/Bi.png'
import bmw from '@assets/logos/BMW.png';
import camaracom from '@assets/logos/CamaraComercio.png';
import camaracons from '@assets/logos/CamaraConstruccion.png';
import cemaco from '@assets/logos/Cemaco.png';
import ducati from '@assets/logos/Ducati.png';
import fundesa from '@assets/logos/Fundesa.png';
import haojue from '@assets/logos/Haojue.png'
import honda from '@assets/logos/Honda.png';
import indiaan from '@assets/logos/Indiaan.png';
import inelac from '@assets/logos/INELAC.png';
import milano from '@assets/logos/Milano.png';
import presto from '@assets/logos/Presto.png';
import royal from  '@assets/logos/RoyalEnfield.png'
import suzuki from '@assets/logos/Suzuki.png';
import tvs from '@assets/logos/TVS.png';
import url from '@assets/logos/URL.png';
import uvg from '@assets/logos/UVG.png';
import vrc from '@assets/logos/VRC.png';
import yamaha from '@assets/logos/Yamaha.png';
import camarain from '@assets/logos/CamaraIndustria.png';
import shell from '@assets/logos/Shell.png';
import uber from '@assets/logos/Uber.png';
import LogoSumate from '@assets/images/sumateLogo.png'
import {LogoWall} from '@molecules/LogosWall';

type ImportedImg = string | { src: string };
const toUrl = (img: ImportedImg): string =>
  typeof img === 'string' ? img : img.src;

type Logo = { src: string; alt?: string };

const logos: Logo[] = [
    { src: toUrl(acmo), alt: 'ACMO' },
    { src: toUrl(asim), alt: 'ASIM' },
    { src: toUrl(avanti), alt: 'Avanti' },
    { src: toUrl(bi), alt: 'Banco Industrial' },
    { src: toUrl(bmw), alt: 'BMW Motorrad' },
    { src: toUrl(camaracom), alt: 'Cámara de Comercio' },
    { src: toUrl(camaracons), alt: 'Cámara de Construcción' },
    { src: toUrl(cemaco), alt: 'Cemaco' },
    { src: toUrl(ducati), alt: 'Ducati' },
    { src: toUrl(fundesa), alt: 'Fundesa' },
    { src: toUrl(haojue), alt: 'Haojue' },
    { src: toUrl(honda), alt: 'Honda' },
    { src: toUrl(indiaan), alt: 'Indian' },
    { src: toUrl(inelac), alt: 'Inelac' },
    { src: toUrl(milano), alt: 'Milano' },
    { src: toUrl(presto), alt: 'Presto' },
    { src: toUrl(royal), alt: 'Royal Enfield' },
    { src: toUrl(suzuki), alt: 'Suzuki' },
    { src: toUrl(tvs), alt: 'TVS' },
    { src: toUrl(url), alt: 'URL' },
    { src: toUrl(uvg), alt: 'UVG' },
    { src: toUrl(vrc), alt: 'VRC' },
    { src: toUrl(yamaha), alt: 'Yamaha' },
    { src: toUrl(camarain), alt: 'Cámara de Industria' },
    { src: toUrl(shell), alt: 'Shell' },
    { src: toUrl(uber), alt: 'Uber' }    
];

const SumateHome: React.FC = () => {
    return (
        <div className={styles.home} style={{ backgroundImage: `url(${bgImage.src})` }}>
            <main className={styles.home__content}>
                <LogoWall logos={logos} centerBadgeSrc={toUrl(LogoSumate)} />            
            </main>
            <div className={styles.home__footerBox}>
                <p className={styles.home__footerText}>Una iniciativa de:</p>
                <img src={toUrl(logo)} alt="Logo" className={styles.home__footerLogo} />
            </div>
        </div>
    );
}

export default SumateHome;