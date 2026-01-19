package banque.helpers;
import org.springframework.stereotype.Component;
import banque.exception.*;
import java.util.regex.Pattern;

@Component
public class ClientHelpers {
    private static final String REGEX_TELEPHONE = "^\\+?[1-9][0-9]{7,14}$";

    public void validerFormatTelephone(String telephone) {
        if (telephone == null || telephone.isBlank()) {
            throw new BanqueException("Le numéro de téléphone est obligatoire.");
        }
        String tel = normaliserTelephone(telephone);
        if (!Pattern.matches(REGEX_TELEPHONE, tel)) {
            throw new BanqueException("Format de téléphone invalide. Utilisez uniquement des chiffres et éventuellement '+' au début.");
        }
    }

    public String normaliserTelephone(String tel) {
        return tel.replaceAll("\\s+", "");
    }

    public boolean isEmail(String value) {
        return value != null && value.matches("^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$");
    }

    public boolean isTelephone(String value) {
        String tel = normaliserTelephone(value);
        return tel != null && tel.matches(REGEX_TELEPHONE);
    }
}
