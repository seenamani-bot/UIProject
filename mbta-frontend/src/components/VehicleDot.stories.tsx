import type { Meta, StoryObj } from "@storybook/react";
import { VehicleDot } from "./VehicleDot";
import { MapContainer, TileLayer } from "react-leaflet";

const meta: Meta<typeof VehicleDot> = {
  title: "Transit/VehicleDot",
  component: VehicleDot,
};
export default meta;

type Story = StoryObj<typeof VehicleDot>;

export const Example: Story = {
  render: () => (
    <div style={{ width: 400, height: 300 }}>
      <MapContainer center={[42.352, -71.055]} zoom={13} style={{ height: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <VehicleDot v={{ id: "1", label: "", latitude: 42.352, longitude: -71.055, bearing: 0, speed: 0, updatedAt: new Date().toISOString(), directionId: 0, currentStatus: "IN_TRANSIT_TO", tripId: "T1", occupancyStatus: null, stopSequence: null, routeId: "Red", statusText: "IN_TRANSIT_TO", delaySec: null }} />
      </MapContainer>
    </div>
  ),
};
