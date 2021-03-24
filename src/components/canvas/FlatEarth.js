// Not really flat... 😂
// cool tool for maps
// https://cpetry.github.io/NormalMap-Online/
import React, { Suspense, useState } from 'react'
import { Environment, MeshDistortMaterial, Sphere } from '@react-three/drei'
import { useSpring } from '@react-spring/core'
import { a } from '@react-spring/three'
import { Vector3 } from 'three'
import { useLoader } from 'react-three-fiber'
import { TextureLoader } from 'three'
import { useA11y, useUserPreferences } from '@react-three/a11y'

const M = a(MeshDistortMaterial)

const getInitialMarkers = () => {
  return [
    { lat: 45.2473453, lon: 19.8191145 },
    { lat: 45.4626482, lon: 9.0376464 },
    { lat: 38.520763, lon: -100.1249827 },
  ].map(({ lat, lon }) => ({
    position: getMarkerPoint(lat, lon).toArray(),
  }))
}

const getMarkerPoint = (lat, lon, radius = 1) => {
  // this should be updated since we are not working with sphere
  const phi = (90 - lat) * (Math.PI / 180),
    theta = (lon + 180) * (Math.PI / 180),
    x = -(radius * Math.sin(phi) * Math.cos(theta)),
    y = -(radius * Math.sin(phi) * Math.sin(theta)),
    z = radius * Math.cos(phi)

  return new Vector3(x, y, z)
}

const Marker = ({ position }) => {
  const { a11yPrefersState } = useUserPreferences()
  const a11y = useA11y()
  const { color } = useSpring({
    color: a11y.focus || a11y.hover ? 'yellow' : 'red',
  })
  return (
    <Sphere args={[0.01, 32, 32]} position={position}>
      <M
        distort={a11yPrefersState.prefersReducedMotion ? 0 : 0.8}
        color={color}
      />
    </Sphere>
  )
}

const Plane = (props) => {
  const texture = useLoader(TextureLoader, 'flat_earth_cover.jpeg')
  const normal = useLoader(TextureLoader, 'flat_earth_normal.png')
  const displacement = useLoader(TextureLoader, 'flat_earth_displacement.png')

  return (
    <mesh position={new Vector3(0, 0, -0.5)} {...props}>
      <planeGeometry args={[5, 5, 150, 150]} />
      <meshStandardMaterial
        map={texture}
        normalMap={normal}
        attach='material'
        displacementMap={displacement}
      />
    </mesh>
  )
}

export default function Earth(props) {
  const [markers, setMarkers] = useState(getInitialMarkers())

  const addMarker = (e) => {
    // intersection won't work...
    const intersection = e.intersections[0]
    if (intersection) {
      setMarkers([...markers, { position: intersection.point.toArray() }])
    }
  }

  return (
    <Suspense fallback={null}>
      <axesHelper args={[5]} />
      <Plane onClick={addMarker} />
      {markers.map((marker, index) => (
        <Marker key={index} position={marker.position} />
      ))}
      <Environment preset={'studio'} />
    </Suspense>
  )
}
