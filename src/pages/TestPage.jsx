import React, { useMemo, useState } from 'react'
import PageHeader from '../components/pageheader/PageHeader'
import ThemeToggle from '../components/theme/ThemeToggle'
import Button from '../components/button/Button'
import Card from '../components/card/Card'
import Input from '../components/input/Input'
import Select from '../components/select/Select'
import CheckBox from '../components/checkbox/CheckBox'
import Table from '../components/table/Table'
import Tabs from '../components/tabs/Tabs'
import ProgressBar from '../components/progressbar/ProgressBar'
import Modal from '../components/modal/Modal'
import SideSheet from '../components/sidesheet/SideSheet'
import Tag from '../components/tag/Tag'
import IconComp from '../components/icon/IconComp'

const sampleTableData = [
  { id: 1, name: 'Notebook', category: 'Office', price: 9.95, stock: 24 },
  { id: 2, name: 'Desk Lamp', category: 'Lighting', price: 22.5, stock: 12 },
  { id: 3, name: 'Wireless Mouse', category: 'Electronics', price: 18.75, stock: 6 },
  { id: 4, name: 'Coffee Mug', category: 'Kitchen', price: 7.2, stock: 35 },
]

const selectOptions = [
  { value: 'Office', label: 'Office' },
  { value: 'Lighting', label: 'Lighting' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Kitchen', label: 'Kitchen' },
]

const tableColumns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price', render: (row) => `$${row.price.toFixed(2)}` },
  { key: 'stock', label: 'Stock' },
]

export default function TestPage() {
  const [text, setText] = useState('Hello world')
  const [selectedCategory, setSelectedCategory] = useState('Office')
  const [checked, setChecked] = useState(true)
  const [progress, setProgress] = useState(45)
  const [modalOpen, setModalOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [tableData, setTableData] = useState(sampleTableData)

  const filteredData = useMemo(
    () => tableData.filter((row) => row.category === selectedCategory),
    [tableData, selectedCategory],
  )

  const tabs = [
    {
      key: 'overview',
      label: 'Overview',
      icon: 'Activity',
      content: (
        <div style={{ display: 'grid', gap: 12 }}>
          <p>Overview content shows a quick summary of the component test state.</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Tag variant="primary">Primary</Tag>
            <Tag variant="success">Success</Tag>
            <Tag variant="warning" outline>
              Warning
            </Tag>
          </div>
        </div>
      ),
    },
    {
      key: 'details',
      label: 'Details',
      icon: 'Info',
      content: (
        <div style={{ display: 'grid', gap: 12 }}>
          <p>This tab renders detail components and interaction examples.</p>
          <Button onClick={() => setModalOpen(true)} variant="secondary">
            Open Modal
          </Button>
          <Button onClick={() => setSheetOpen(true)} variant="outline">
            Open SideSheet
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div style={{ minHeight: '100vh', padding: 24, background: 'var(--app-bg)', color: 'var(--app-fg)' }}>
      <PageHeader
        title="Component Test Page"
        subtitle="Initialize and inspect all major UI components"
        actions={<ThemeToggle />}
      />

      <div style={{ display: 'grid', gap: 20 }}>
        <Card title="Form Controls" subtitle="Inputs, select and checkbox">
          <div style={{ display: 'grid', gap: 16 }}>
            <Input
              label="Text input"
              placeholder="Type something"
              value={text}
              onChange={(e) => setText(e.target.value)}
              leftIcon="Search"
              rightIcon="Check"
            />
            <Select
              label="Select category"
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={selectOptions}
            />
            <CheckBox
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              label="Enable feature"
            />
          </div>
        </Card>

        <Card title="Actions" subtitle="Buttons and icons">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            <Button onClick={() => setProgress((p) => Math.min(100, p + 10))}>Increase Progress</Button>
            <Button variant="success" icon="CheckCircle">
              Success
            </Button>
            <Button variant="warning" rightIcon="AlertTriangle">
              Warning
            </Button>
            <Button variant="ghost" icon="Loader" loading>
              Loading
            </Button>
            <IconComp name="Rocket" size={28} animate="pop" animateMode="hover" />
            <IconComp name="Sparkles" size={28} animate="spin" animateMode="infinite" />
          </div>
        </Card>

        <Card title="Progress" subtitle="Progress bar and slider">
          <div style={{ display: 'grid', gap: 12 }}>
            <ProgressBar value={progress} label="Progress" animated striped />
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </Card>

        <Card title="Tabs" subtitle="Component tab navigation">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </Card>

        <Card title="Data Table" subtitle="Table component with filtered rows">
          <Table
            columns={tableColumns}
            data={filteredData}
            onRowClick={(row) => window.alert(`Clicked ${row.name}`)}
          />
        </Card>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Test Modal"
        subtitle="Modal content for QA"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => setModalOpen(false)} variant="outline">
              Close
            </Button>
            <Button onClick={() => setModalOpen(false)} variant="success">
              Confirm
            </Button>
          </div>
        }
      >
        <p style={{ margin: 0 }}>This is a test modal. Use the close button or the buttons below.</p>
      </Modal>

      <SideSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Test SideSheet">
        <div style={{ display: 'grid', gap: 12 }}>
          <p>SideSheet content area for testing overlay behavior and animations.</p>
          <Button onClick={() => setSheetOpen(false)}>Dismiss</Button>
        </div>
      </SideSheet>
    </div>
  )
}
