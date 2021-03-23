import React, { useEffect, useState, Suspense } from 'react'
import {
  Environment,
  MeshDistortMaterial,
  Sphere,
  Text,
} from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useA11y, useUserPreferences } from '@react-three/a11y'
import { useSpring } from '@react-spring/core'
import { a } from '@react-spring/three'
import { Vector3 } from 'three'

const M = a(MeshDistortMaterial)

const getInitialMarkers = () => {
  return [
    { lat: 45.2473453, lon: 19.8191145 },
    { lat: 45.4626482, lon: 9.0376464 },
    { lat: 38.520763, lon: -100.1249827 }
  ].map(({ lat, lon }) => ({
    position: getMarkerPoint(lat, lon).toArray(),
  }))
}

const getMarkerPoint = (lat, lon, radius = 1) => {
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

export default function Earth(props) {
  const [earthModel, setEarthModel] = useState(null)
  const [markers, setMarkers] = useState(getInitialMarkers())

  const addMarker = (e) => {
    const intersection = e.intersections[0]
    if (intersection) {
      setMarkers([...markers, { position: intersection.point.toArray() }])
    }
  }

  useEffect(() => {
    const loader = new GLTFLoader()
    loader.load('/earth/scene.gltf', async (gltf) => {
      const nodes = await gltf.parser.getDependencies('node')
      setEarthModel(nodes[5])
    })
  }, [])

  return (
    <Suspense fallback={null}>
      {/* <axesHelper args={[5]} /> */}
      {!earthModel && (
        <Text color='white' anchorX='center' anchorY='middle' fontSize={2}>
          Loading...
        </Text>
      )}
      {earthModel && (
        <mesh
          material={earthModel.material}
          geometry={earthModel.geometry}
          onClick={addMarker}
        />
      )}
      {markers.map((marker, index) => (
        <Marker key={index} position={marker.position} />
      ))}
      <Environment preset={'studio'} />
    </Suspense>
  )
}
