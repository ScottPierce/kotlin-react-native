package com.example

import react.React
import react.Style
import react.native.AppRegistry
import react.native.Platform
import react.native.registerComponent
import react.native.select
import react.view

fun main(args: Array<String>) {
  println("Main Kotlin function is running...")
  AppRegistry.registerComponent<HelloWorld>("HaulTest")
}

class HelloWorld : React.Component<Any, Any>() {
  override fun render(): dynamic {
    throw RuntimeException("Example Crash")

    return view {
      text("HelloTest1", Style(backgroundColor = "blue", fontSize = 50))
      button("Button Test!") {
        println("Test Button Clicked!")
      }
      component(SubComponent())
      text(Platform.select("ios", "android"))
      text("Platform Version: ${Platform.VERSION}")
    }
  }
}

class SubComponent : React.Component<Any, Any>() {
  override fun render(): dynamic {
    return view {
      text("I am a sub-component!!!")
    }
  }
}

