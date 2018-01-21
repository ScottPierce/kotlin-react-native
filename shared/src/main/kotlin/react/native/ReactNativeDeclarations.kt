@file:JsModule("react-native")
@file:Suppress("unused")

package react.native

import react.React

external object AppRegistry {
  fun <T : React.Component<*, *>> registerComponent(name: String, createComponent: () -> JsClass<T>)
}

external interface PlatformSelectConfig<T> {
  var ios: T
  var android: T
}

external object StyleSheet {
  fun create(style: dynamic): dynamic
}

external object Platform {
  /**
   * Has the value 'ios' or 'android'
   */
  val OS: String

  /**
   * On iOS, the [VERSION] is a result of -[UIDevice systemVersion], which is a [String] with the
   * current version of the operating system. An example of the system version is "10.3".
   *
   * On Android, the [VERSION] is an [Int] representing the api level. An example is that
   */
  @JsName("Version")
  val VERSION: dynamic

  fun <T> select(select: PlatformSelectConfig<T>): T
}

external class View
external object Text
external object Button
