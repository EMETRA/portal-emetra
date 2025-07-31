'use client'

import React, { useState } from "react";
import {CardContainer}        from "../../server/atoms/index";
import {Tabs, CardBody, SubscribeForm, UnsubscribeForm}        from "../../server/molecules/index";

const NotificationsCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"subscribe" | "unsubscribe">("subscribe");

  const tabItems = [
    { id: "subscribe",   label: "Suscripción aviso multas"   },
    { id: "unsubscribe", label: "Desuscripción aviso multas" }
  ];

  return (
    <CardContainer>
      <Tabs items={tabItems} activeId={activeTab} onChange={(id: string) => setActiveTab(id as "subscribe" | "unsubscribe")} />
      <CardBody>
        {activeTab === "subscribe" 
          ? <SubscribeForm /> 
          : <UnsubscribeForm />}
      </CardBody>
    </CardContainer>
  );
};

export default NotificationsCard;
