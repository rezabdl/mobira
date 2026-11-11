'use client'

import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Camera, Check, Gauge, Grid2X2, Heart, List, MapPin, Menu, Search, Settings2, SlidersHorizontal, Upload, X } from 'lucide-react'
import { vehicles, formatPrice, type Vehicle } from '@/lib/vehicles'

export function Navbar({ active = 'Home' }: { active?: string }) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <header className="site-nav">
      <Link href="/" className="wordmark" aria-label="MOBIRA home">MOBIRA<span>.</span></Link>
      <nav aria-label="Main navigation" className={menuOpen ? 'nav-open' : ''}>
        <Link className={active === 'Home' ? 'active' : ''} href="/">Home</Link>
        <Link className={active === 'Cars' ? 'active' : ''} href="/cars">Cars</Link>
        <Link className={active === 'About Us' ? 'active' : ''} href="/about">About Us</Link>
      </nav>
      <Link className="nav-cta" href="/cars">Browse cars <ArrowUpRight size={15}/></Link>
      <button className="mobile-menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Menu size={21}/></button>
    </header>
  )
}

export function Footer() {
  return <footer className="footer"><div className="footer-main"><div><Link href="/" className="wordmark">MOBIRA<span>.</span></Link><p>A better way to find the car<br/>that feels right for you.</p></div><div className="footer-links"><Link href="/cars">Browse cars</Link><Link href="/about">About Mobira</Link><a href="/about#disclaimer">Disclaimer</a></div><span className="footer-note">DEMO LISTINGS · FOR DISPLAY ONLY</span></div><div className="footer-bottom"><span>© 2025 MOBIRA. Find your next drive.</span><span>Made for everyday car shopping.</span></div></footer>
}

export function ImageSearchDialog({ onClose }: { onClose: () => void }) {
  const input = useRef<HTMLInputElement>(null)
  const imageUrl = useRef<string | null>(null)
  const [image, setImage] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  const [error, setError] = useState('')

  function choose(file?: File) {
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Choose an image file to continue.'); return }
    if (file.size > 10 * 1024 * 1024) { setError('This image is larger than 10 MB. Choose a smaller file.'); return }
    if (imageUrl.current) URL.revokeObjectURL(imageUrl.current)
    const nextUrl = URL.createObjectURL(file)
    imageUrl.current = nextUrl
    setImage(nextUrl)
    setError('')
    setStatus('idle')
  }

  function close() {
    if (imageUrl.current) URL.revokeObjectURL(imageUrl.current)
    onClose()
  }

  function search() {
    setStatus('loading')
    window.setTimeout(() => setStatus('success'), 650)
  }

  return <div className="modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) close() }} onKeyDown={event => { if (event.key === 'Escape') close() }}><section className="image-modal" role="dialog" aria-modal="true" aria-labelledby="image-title" tabIndex={-1}><button className="modal-close" onClick={close} aria-label="Close image search"><X/></button><div className="modal-kicker"><Camera size={15}/> SEARCH A DIFFERENT WAY</div><h2 id="image-title">Start with a photo</h2><p className="modal-description">Upload a vehicle photo to see similar demo listings.</p>{status === 'success' ? <div className="match-result"><div className="success-icon"><Check/></div><h3>Here are a few to explore</h3><p>These demo cars are suggestions, not image-recognition results.</p><div className="match-mini">{vehicles.slice(0, 2).map(vehicle => <Link href={`/cars/${vehicle.id}`} key={vehicle.id} onClick={close}><img src={vehicle.image} alt=""/><span>{vehicle.name}<b>{formatPrice(vehicle.price)}</b></span><ArrowUpRight size={17}/></Link>)}</div><button className="button-primary full" onClick={close}>Browse all cars <ArrowRight size={16}/></button></div> : <>{image ? <div className="upload-preview"><img src={image} alt="Selected vehicle"/><button className="replace-image" onClick={() => input.current?.click()}><Upload size={14}/> Replace photo</button><button className="remove-image" onClick={() => { if (imageUrl.current) URL.revokeObjectURL(imageUrl.current); imageUrl.current = null; setImage(null); setStatus('idle') }} aria-label="Remove photo"><X size={16}/></button></div> : <button className="drop-area" onClick={() => input.current?.click()} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); choose(event.dataTransfer.files[0]) }}><span className="upload-icon"><Upload size={22}/></span><strong>Drop a car photo here</strong><span>or <u>browse your files</u></span><small>JPG, PNG or WEBP · Up to 10 MB</small></button>}<input ref={input} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={event => choose(event.target.files?.[0])}/>{error && <p className="upload-error" role="alert">{error}</p>}<button disabled={!image || status === 'loading'} className="button-primary full" onClick={search}>{status === 'loading' ? <><span className="spinner"/> Finding similar cars...</> : <>Show similar cars <ArrowRight size={16}/></>}</button><p className="privacy-note">Photo search is a demo. No photo is uploaded.</p></>}</section></div>
}

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const [saved, setSaved] = useState(false)
  return <article className="vehicle-card"><div className="vehicle-photo"><Link href={`/cars/${vehicle.id}`} aria-label={`View ${vehicle.name}`}><img src={vehicle.image} alt={`${vehicle.name} listing`} loading="lazy"/></Link>{vehicle.tag && <span className="photo-tag">{vehicle.tag}</span>}<button type="button" aria-label={saved ? 'Remove from saved cars' : 'Save car'} aria-pressed={saved} className={`save-button ${saved ? 'saved' : ''}`} onClick={() => setSaved(!saved)}><Heart size={17} fill={saved ? 'currentColor' : 'none'}/></button></div><div className="vehicle-info"><div className="vehicle-title-row"><Link href={`/cars/${vehicle.id}`}><h3>{vehicle.name}</h3></Link><span className="vehicle-year">{vehicle.year}</span></div><div className="vehicle-meta"><span><Gauge size={14}/>{vehicle.mileage}</span><span><Settings2 size={14}/>{vehicle.transmission}</span></div><div className="vehicle-bottom"><span className="vehicle-location"><MapPin size={13}/>{vehicle.city}</span><strong>{formatPrice(vehicle.price)}</strong></div><span className="listing-demo-label">Demo listing</span></div></article>
}

export function Marketplace({ compact = false, initialQuery = '' }: { compact?: boolean; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery)
  const [brand, setBrand] = useState('')
  const [sort, setSort] = useState('Recommended')
  const [showImage, setShowImage] = useState(false)
  const [mobileFilters, setMobileFilters] = useState(false)
  const [list, setList] = useState(false)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minYear, setMinYear] = useState('')
  const [maxYear, setMaxYear] = useState('')
  const [transmission, setTransmission] = useState('')
  const [fuelType, setFuelType] = useState('')
  const [location, setLocation] = useState('')

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    const results = vehicles.filter(vehicle => {
      const searchable = `${vehicle.name} ${vehicle.city} ${vehicle.fuel}`.toLowerCase()
      return (!q || searchable.includes(q)) && (!brand || vehicle.name.toLowerCase().includes(brand.toLowerCase())) && (!minPrice || vehicle.price >= Number(minPrice) * 1_000_000) && (!maxPrice || vehicle.price <= Number(maxPrice) * 1_000_000) && (!minYear || vehicle.year >= Number(minYear)) && (!maxYear || vehicle.year <= Number(maxYear)) && (!transmission || vehicle.transmission === transmission) && (!fuelType || vehicle.fuel === fuelType) && (!location || vehicle.city === location)
    })
    return results.sort((a, b) => sort === 'Lowest price' ? a.price - b.price : sort === 'Highest price' ? b.price - a.price : sort === 'Newest' ? b.year - a.year : 0)
  }, [query, brand, minPrice, maxPrice, minYear, maxYear, transmission, fuelType, location, sort])

  function resetFilters() {
    setQuery(''); setBrand(''); setMinPrice(''); setMaxPrice(''); setMinYear(''); setMaxYear(''); setTransmission(''); setFuelType(''); setLocation('')
  }

  function toggleValue(value: string, current: string, setter: React.Dispatch<React.SetStateAction<string>>) {
    setter(current === value ? '' : value)
  }

  return <><section className={`marketplace ${compact ? 'marketplace-compact' : ''}`}><aside className={`filter-sidebar ${mobileFilters ? 'filters-open' : ''}`}><div className="filter-heading"><div><SlidersHorizontal size={17}/><strong>Filter cars</strong></div><button onClick={resetFilters}>Clear all</button><button className="filter-close" onClick={() => setMobileFilters(false)} aria-label="Close filters"><X size={19}/></button></div><label className="filter-search"><Search size={17}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Make, model or city"/></label><div className="filter-section"><h4>MAKE</h4>{['Toyota', 'Honda', 'Daihatsu', 'Mitsubishi', 'Suzuki', 'Nissan'].map(make => <label className="check-row" key={make}><input type="checkbox" checked={brand === make} onChange={() => setBrand(brand === make ? '' : make)}/><span>{make}</span><small>{vehicles.filter(vehicle => vehicle.name.toLowerCase().includes(make.toLowerCase())).length}</small></label>)}</div><div className="filter-section"><h4>PRICE RANGE <span>Rp · million</span></h4><div className="price-range"><input inputMode="numeric" value={minPrice} onChange={event => setMinPrice(event.target.value.replace(/\D/g, ''))} aria-label="Minimum price in millions of rupiah" placeholder="Min. 150"/><span>—</span><input inputMode="numeric" value={maxPrice} onChange={event => setMaxPrice(event.target.value.replace(/\D/g, ''))} aria-label="Maximum price in millions of rupiah" placeholder="Max. 500"/></div></div><div className="filter-section"><h4>YEAR</h4><div className="price-range"><input inputMode="numeric" value={minYear} onChange={event => setMinYear(event.target.value.replace(/\D/g, '').slice(0, 4))} aria-label="From year" placeholder="From 2020"/><span>—</span><input inputMode="numeric" value={maxYear} onChange={event => setMaxYear(event.target.value.replace(/\D/g, '').slice(0, 4))} aria-label="To year" placeholder="To 2025"/></div></div><div className="filter-section"><h4>TRANSMISSION</h4><div className="pill-options">{['Automatic', 'Manual'].map(value => <button type="button" aria-pressed={transmission === value} className={transmission === value ? 'selected' : ''} onClick={() => toggleValue(value, transmission, setTransmission)} key={value}>{value}</button>)}</div></div><div className="filter-section"><h4>FUEL TYPE</h4><div className="pill-options wrap">{['Gasoline', 'Diesel', 'Hybrid', 'Electric'].map(value => <button type="button" aria-pressed={fuelType === value} className={fuelType === value ? 'selected' : ''} onClick={() => toggleValue(value, fuelType, setFuelType)} key={value}>{value}</button>)}</div></div><div className="filter-section"><h4>LOCATION</h4><label className="location-select"><MapPin size={15}/><select aria-label="Filter by city" value={location} onChange={event => setLocation(event.target.value)}><option value="">All Indonesia</option>{[...new Set(vehicles.map(vehicle => vehicle.city))].map(city => <option key={city} value={city}>{city}</option>)}</select></label></div><button className="button-primary full apply-filters" onClick={() => setMobileFilters(false)}>Show {filtered.length} cars</button></aside><div className="listing-area"><div className="listing-top"><div><div className="eyebrow">DEMO CARS ACROSS INDONESIA</div><h1>{compact ? 'Find your next car' : 'Cars for sale'} <span aria-live="polite" aria-atomic="true">({filtered.length})</span></h1><p>Compare price, mileage and location at a glance.</p></div><div className="listing-controls"><button className="image-search-compact" onClick={() => setShowImage(true)}><Camera size={15}/><span>Search by image</span></button><button className="mobile-filter-trigger" onClick={() => setMobileFilters(true)}><SlidersHorizontal size={16}/> Filters</button><label className="sort-select">Sort by <select value={sort} onChange={event => setSort(event.target.value)}><option>Recommended</option><option>Newest</option><option>Lowest price</option><option>Highest price</option></select></label><button aria-label="Grid view" aria-pressed={!list} className={`view-toggle ${!list ? 'selected' : ''}`} onClick={() => setList(false)}><Grid2X2 className="grid-glyph" aria-hidden="true" size={15}/></button><button aria-label="List view" aria-pressed={list} className={`view-toggle ${list ? 'selected' : ''}`} onClick={() => setList(true)}><List className="list-glyph" aria-hidden="true" size={15}/></button></div></div><div className={`vehicle-grid ${list ? 'list-view' : ''}`}>{filtered.length ? filtered.map(vehicle => <VehicleCard vehicle={vehicle} key={vehicle.id}/>) : <div className="no-results"><Search/><h3>No cars match those filters</h3><p>Try a different search or clear a few filters.</p><button className="text-button" onClick={resetFilters}>Clear filters <ArrowRight size={15}/></button></div>}</div><div className="demo-notice">Demo listings only. Prices and availability are illustrative.</div></div></section>{showImage && <ImageSearchDialog onClose={() => setShowImage(false)}/>}</>
}

export function ImageSearchCTA() {
  const [open, setOpen] = useState(false)
  return <><button onClick={() => setOpen(true)} className="image-search-button"><Camera size={18}/> Search by image</button>{open && <ImageSearchDialog onClose={() => setOpen(false)}/>}</>
}
