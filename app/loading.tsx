import React from 'react'
import {CircularProgress} from "@nextui-org/react";

export default function Loading() {
  return (
    <div className='flex h-full w-full items-center justify-center bg-background'>
        <CircularProgress color="primary" aria-label="Loading..."/>
    </div>

)
}
