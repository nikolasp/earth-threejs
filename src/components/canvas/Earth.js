import React, { useEffect, useState, Suspense } from 'react'
import { Environment } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default function Earth(props) {
  const [earthModel, setEarthModel] = useState(null)
  useEffect(() => {
    const loader = new GLTFLoader()
    loader.load('/earth/scene.gltf', async (gltf) => {
      const nodes = await gltf.parser.getDependencies('node')
      setEarthModel(nodes[5])
      console.log({ nodes })
    })
  }, [])

  return (
    <Suspense fallback={null}>
      {earthModel && (
        <mesh material={earthModel.material} geometry={earthModel.geometry} />
      )}
      <Environment preset={'studio'} />
    </Suspense>
  )
}
