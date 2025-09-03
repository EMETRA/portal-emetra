'use client';
import React from 'react';
import { SumateHome, SumateAntecedentes, SumateInfo, SumateInst, SumateUni, SumateHow, SumateConoce, FullPageSnap, SumateInscribete} from '@/components/organisms';
// import { SumateNavBar } from '@/components/molecules';
import logo from '@assets/logos/LogoSumate.png';
const SumatePage: React.FC = () => {
    const sections = [
        <SumateHome key="home"/>,
        <SumateAntecedentes key="SumateAntecedentes"/>,
        <SumateInfo key="SumateInfo"/>,
        <SumateInst key="SumateInst"/>,
        <SumateUni key="SumateUni"/>,
        <SumateHow key="SumateHow"/>,
        <SumateConoce key="SumateConoce"/>,
        <SumateInscribete key="SumateInscribete"/>
    ]
    return (
        <div style={{ position: 'relative' }}>
            {/* <div style={{  position: 'absolute', insetInline: 0, top: 0,  height: 'var(--page-top-gap, 72px)', zIndex: 10, pointerEvents: 'auto'}}>
                <SumateNavBar
                    logo={typeof logo === 'string' ? logo : (logo as any).src}
                    items={[
                        { label: 'ANTECEDENTES', index: 1 },
                        { label: 'PROYECTO SÚMATE', index: 6 },
                        {
                        label: 'CÓMO SUMARTE', index: 5, children: [
                            { label: 'Universidades', index: 4 },
                            { label: 'Instituciones públicas', index: 3 },
                        ]
                        },
                        { label: 'FORMULARIO INSCRIPCIÓN', index: 7 },
                    ]}
                    />
            </div> */}
            <FullPageSnap sections={sections}
                snapAlign='start'
                snapStopAlways={true}
                withKeyboardNav={true} />
        </div>
        
    );
};

export default SumatePage;