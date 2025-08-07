'use client'

import React, {useState} from 'react'
import {CardContainer} from '../../server/atoms/index'
import {Tabs, CardBody} from '../../server/molecules/index'
import {RegistroForm, ReciboForm} from '../../molecules/index'

const ExpedientesCard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"registrar" | "consultar">("registrar");

    const tabItems = [
        {id: "registrar", label: "Registrar expediente"},
        {id: "consultar", label: "Consultar expediente"}
    ];

    return (
        <CardContainer>
            <Tabs items={tabItems} activeId={activeTab} onChange={(id: string) => setActiveTab(id as "registrar" | "consultar")} />
            <CardBody>
                {activeTab === "registrar"
                    ? <RegistroForm />
                    : <div>Contenido para consultar expediente</div>}
            </CardBody>
        </CardContainer>
    )
}

export default ExpedientesCard;