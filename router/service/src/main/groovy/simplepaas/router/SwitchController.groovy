package simplepaas.router

import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseBody

@Controller
@EnableAutoConfiguration
class SwitchController {

  RouteStore routeStore = new RouteStore()

  @RequestMapping("/")
  @ResponseBody
  String home() {
    return "Hello World!";
  }


  /*

  create a new port mapping, given a target container/ port, create socat tunnel for it.
      * store the mapping.
      * future, consider security, restricting the port to a particular source IP.

  destroy a port mapping.
      * kill the appropriate socat instance.

  list the tunnels.
     * switch port
     * target container/ port
     * source container.
   */

  public static void main(String[] args) throws Exception {
    SpringApplication.run(SwitchController.class, args);
  }
}
