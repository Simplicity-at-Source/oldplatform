
@Controller
class SwitchController {

  @RequestMapping("/")
  @ResponseBody
  def run() {
	[message:"awesome"]
  }

} 
