
export default class PlayerData {
    private constructor() {

    }

    public static SetItem(key: string, userData: any) {
        cc.sys.localStorage.setItem(key, PlayerData.Encrypt(JSON.stringify(userData)));
    }

    public static GetItem(key: string) {
        var titem = cc.sys.localStorage.getItem(key);
        if (titem != null)
            return JSON.parse(PlayerData.Encrypt(titem));
        else
            return null;
    }

    public static RemoveItem(key: string) {
        cc.sys.localStorage.removeItem(key);
    }

    public static encryption: Number[] = [2, 3, 6, 9, 4, 7, 4, 5, 8, , 2, 5, 6, 8];     //密钥
    public static Encrypt(sor) {
        var arr = sor.split('');
        let index = 0;
        var result = arr.map(function (item) {
            var newItem = PlayerData.xor(item, index);
            index++;
            if (index >= PlayerData.encryption.length)
                index = 0;
            return newItem;
        });
        return result.join('');
    }

    public static xor(msg, index) {
        var ecnumber: any = PlayerData.encryption[index];
        var num10 = msg.charCodeAt();
        var numXOR = num10 ^ ecnumber;
        return String.fromCharCode(numXOR);
    }
}